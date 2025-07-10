import { Component, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Utente } from '../../models/utente.interface';
import { UtenteService } from '../../core/services/utentes.service';
import { MarcacaoService } from '../../core/services/marcacao';
import { Router } from '@angular/router';

@Component({
  selector: 'app-utente',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './utente.component.html',
  styleUrls: ['./utente.component.css']
})
export class UtenteComponent {
  registoForm!: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  private utenteService = inject(UtenteService)
  private marcacaoService = inject(MarcacaoService)
  private router = inject(Router)
  isLoading = signal(false);
  errorMessage = signal('');

  private http = inject(HttpClient);

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.registoForm = this.fb.group({
      numeroUtente: ['', Validators.required],
      nomeCompleto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telemovel: ['', Validators.required],
      genero: ['', Validators.required],
      dataNascimento: ['', Validators.required],

      rua: [''],
      numeroPorta: [''],
      andarLado: [''],
      localidade: ['', Validators.required],
      fotografia: [''],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.registoForm.patchValue({ fotografia: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedFile = null;
      this.imagePreview = null;
      this.registoForm.patchValue({ fotografia: null });
    }
  }


  async onSubmit(): Promise<void> {
    if (this.registoForm.valid) {

      this.isLoading.set(true);
      this.errorMessage.set('');
      const utente = this.registoForm.value;
      console.log("Passou aqui", utente)

      const dataComHora = new Date(`${utente.dataNascimento}T14:00:23.204Z`);
      const formData = new FormData();
      formData.append('numeroUtente', utente.numeroUtente);
      formData.append('nomeCompleto', utente.nomeCompleto);
      formData.append('email', utente.email);
      formData.append('telemovel', utente.telemovel);
      formData.append('genero', utente.genero);
      formData.append('dataNascimento', dataComHora.toISOString());
      formData.append('rua', utente.rua);
      formData.append('numeroPorta', utente.numeroPorta);
      formData.append('andarLado', utente.andarLado);
      formData.append('localidade', utente.localidade);
      formData.append('Fotografia', utente.fotografia);



      try {
        this.utenteService.createUtente(formData).subscribe({
          next: (res) => {
            console.log('Utente criado com sucesso', res);
            this.fazerPedidoMarcacao(res.id);
          },
          error: (err) => console.error('Erro', err)
        });
      } catch (error) {
        console.error(error);
        alert('Erro ao enviar marcação.');
      }
    } else {
      this.registoForm.markAllAsTouched();
      this.errorMessage.set('Por favor preencha todos os campos obrigatórios.');
    }
  }

  onCancel(): void {
    this.registoForm.reset();
    this.imagePreview = null;
    this.selectedFile = null;
    console.log('Registo cancelado.');
  }

  private fazerPedidoMarcacao(utenteId: string): void {
    const marcacaoPendente = localStorage.getItem('consulta_pendente');

    if (marcacaoPendente) {
      const marcacao = JSON.parse(marcacaoPendente);
      marcacao.utenteId = utenteId;

      console.log(marcacao);

      this.marcacaoService.createMarcacao(marcacao).subscribe({
        next: (res) => {
          this.router.navigate(['/marcacao-sucesso']);
          localStorage.removeItem('consulta_pendente'); // limpa após sucesso
        },
        error: (err) => console.error('Erro ao criar marcação', err)
      });
    } else {
      console.warn('Nenhuma marcação pendente encontrada no localStorage.');
    }
  }


}
