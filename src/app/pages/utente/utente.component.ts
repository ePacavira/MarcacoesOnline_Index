import { Component, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { User } from '../../core/models/user.model';
import { UtenteService } from '../../core/services/utentes.service';
import { Router } from '@angular/router';
import { PedidoMarcacao } from '../../models/marcacao.interface';
import { MarcacaoService } from '../../core/services/marcacao.service';
import { Marcacao } from '../../core/services/marcacao.service';

@Component({
  selector: 'app-utente',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './utente.component.html',
  styleUrls: ['./utente.component.css']
})
export class UtenteComponent {
  registoForm!: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  private utenteService = inject(UtenteService)
  private router = inject(Router)
  private marcacaoService = inject(MarcacaoService);
  isLoading = signal(false);
  errorMessage = signal('');

  // Step de progresso: 0 = Registro, 1 = Dados Pessoais, 2 = Confirmação
  stepAtual = signal(0);

  private http = inject(HttpClient);

  marcacoes: PedidoMarcacao[] = [];
  totalPendentes = 0;
  totalConfirmadas = 0;
  totalRealizadas = 0;

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
      fotografia: [''],
    });

    // Puxar marcações do utente autenticado (exemplo: id guardado no localStorage)
    const utenteId = localStorage.getItem('utenteId');
    if (utenteId) {
      this.marcacaoService.getMarcacoesUtente(Number(utenteId)).subscribe({
        next: (marcacoes: Marcacao[]) => {
          // Adaptar para PedidoMarcacao[] se necessário
          const minhasMarcacoes = marcacoes.map(m => ({
            ...m,
            actosClinicos: [], // ou adaptar conforme necessário
            dataFimPreferida: '', // ou adaptar conforme necessário
            horarioPreferido: m.horarioPreferido || '',
            estado: m.estado,
            utenteId: String(m.utenteId)
          })) as PedidoMarcacao[];
          this.marcacoes = minhasMarcacoes;
          this.totalPendentes = minhasMarcacoes.filter(m => m.estado === 'Pendente').length;
          this.totalConfirmadas = minhasMarcacoes.filter(m => m.estado === 'Confirmada').length;
          this.totalRealizadas = minhasMarcacoes.filter(m => m.estado === 'Realizada').length;
        },
        error: () => {
          this.marcacoes = [];
          this.totalPendentes = 0;
          this.totalConfirmadas = 0;
          this.totalRealizadas = 0;
        }
      });
    }
  }

  // Step: Volta para Registro ao clicar na seta
  onCancel(): void {
    this.registoForm.reset();
    this.imagePreview = null;
    this.selectedFile = null;
    this.stepAtual.set(0); // Volta para Registro
    console.log('Registo cancelado.');
  }

  // Step: Qualquer campo do formulário vai para Dados Pessoais
  onFormFieldInteraction(): void {
    if (this.stepAtual() === 0) {
      this.stepAtual.set(1);
    }
  }

  // Step: Dados Pessoais → Confirmação quando tudo preenchido
  onFormChange(): void {
    if (this.stepAtual() === 1) {
      const controls = this.registoForm.controls;
      if (
        controls['nomeCompleto'].valid &&
        controls['email'].valid &&
        controls['telemovel'].valid &&
        controls['genero'].valid &&
        controls['dataNascimento'].valid
      ) {
        this.stepAtual.set(2);
      } else {
        this.stepAtual.set(1);
      }
    }
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
      const utenteObj = {
        numeroUtente: utente.numeroUtente,
        nomeCompleto: utente.nomeCompleto,
        email: utente.email,
        telemovel: utente.telemovel,
        genero: utente.genero,
        dataNascimento: dataComHora.toISOString(),
        rua: utente.rua,
        fotografia: utente.fotografia
      };
      this.utenteService.createUtente(utenteObj).subscribe({
        next: (res: any) => {
          console.log('Utente criado com sucesso', res);
          this.fazerPedidoMarcacao(String(res.id));
        },
        error: (err: any) => console.error('Erro', err)
      });
    } else {
      this.registoForm.markAllAsTouched();
      this.errorMessage.set('Por favor preencha todos os campos obrigatórios.');
    }
  }

  private fazerPedidoMarcacao(utenteId: string): void {
    const marcacaoPendente = localStorage.getItem('consulta_pendente');

    if (marcacaoPendente) {
      const marcacao = JSON.parse(marcacaoPendente);
      marcacao.utenteId = utenteId;

      console.log(marcacao);

      this.marcacaoService.criarMarcacao(marcacao).subscribe({
        next: (res: any) => {
          this.router.navigate(['/marcacao-sucesso']);
          localStorage.removeItem('consulta_pendente'); // limpa após sucesso
        },
        error: (err: any) => console.error('Erro ao criar marcação', err)
      });
    } else {
      console.warn('Nenhuma marcação pendente encontrada no localStorage.');
    }
  }


}
