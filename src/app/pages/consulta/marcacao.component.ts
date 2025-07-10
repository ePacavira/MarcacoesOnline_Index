import { Component, signal, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PedidoMarcacao } from '../../models/marcacao.interface';
import { MarcacaoService } from '../../core/services/marcacao';
@Component({
    selector: 'app-consulta',
    imports: [ReactiveFormsModule],
    templateUrl: './marcacao.component.html',
    styleUrl: './marcacao.component.css'
})
export class ConsultaComponent {
    marcacaoForm!: FormGroup;
    private marcacaoService = inject(MarcacaoService)
    utenteLogado = { // Simulação
        nome: 'Kambaia L. Alberto',
        numero: '987654321'
    };

    constructor(
        private fb: FormBuilder,
        private router: Router // Adicione esta linha
    ) { }
    isLoading = signal(false)
    errorMessage = signal("")
    ngOnInit(): void {
        this.marcacaoForm = this.fb.group({
            actosClinicos: this.fb.array([]), // Se inicializar como um array vazio, nada aparecerá inicialmente
            dataInicioPreferida: ['', Validators.required],
            dataFimPreferida: ['', Validators.required],
            horarioPreferido: ['', Validators.required],
            observacoes: [''],

        });
        this.adicionarActoClinico();

    }

    get actosClinicos(): FormArray {
        return this.marcacaoForm.get('actosClinicos') as FormArray;
    }

    novoActoClinico(): FormGroup {
        return this.fb.group({
            tipo: ['', Validators.required],
            subsistemaSaude: ['', Validators.required],
            profissional: [''],
        });
    }

    adicionarActoClinico(): void {
        console.log("Olá")
        this.actosClinicos.push(this.novoActoClinico());
    }

    removerActoClinico(index: number): void {
        if (this.actosClinicos.length > 1) {
            this.actosClinicos.removeAt(index);
        } else {
            alert("É necessário pelo menos um acto clínico.");
        }
    }

    onSubmit(): void {
        console.log(this.marcacaoForm.value)
        if (this.marcacaoForm.valid) {
            this.isLoading.set(true)
            this.errorMessage.set("")

            const formData = this.marcacaoForm.value;

            localStorage.setItem("consulta_pendente", JSON.stringify(formData))
            if(localStorage.getItem('consulta_pendente')){
                this.router.navigate(["/utente"])
            }
        }
    }

    
    onCancelMarcacao(): void {
        this.marcacaoForm.reset();
        while (this.actosClinicos.length !== 0) { this.actosClinicos.removeAt(0); }
        this.adicionarActoClinico();
        console.log('Marcação cancelada/limpa.');
    }
}
