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
        private router: Router
    ) { }
    
    isLoading = signal(false)
    errorMessage = signal("")
    
    // Step de progresso: 0 = Actos Clínicos, 1 = Preferências, 2 = Confirmação
    stepAtual = signal(0);
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

    
    // Step: Volta para Actos Clínicos ao clicar no cancelar
    onCancelMarcacao(): void {
        this.marcacaoForm.reset();
        while (this.actosClinicos.length !== 0) { this.actosClinicos.removeAt(0); }
        this.adicionarActoClinico();
        this.stepAtual.set(0); // Volta para Actos Clínicos
        console.log('Marcação cancelada/limpa.');
    }

    // Step: Qualquer campo do formulário vai para Preferências
    onFormFieldInteraction(): void {
        if (this.stepAtual() === 0) {
            this.stepAtual.set(1);
        }
    }

    // Step: Preferências → Confirmação quando tudo preenchido
    onFormChange(): void {
        if (this.stepAtual() === 1) {
            const controls = this.marcacaoForm.controls;
            if (
                controls['dataInicioPreferida'].valid &&
                controls['dataFimPreferida'].valid &&
                controls['horarioPreferido'].valid
            ) {
                this.stepAtual.set(2);
            } else {
                this.stepAtual.set(1);
            }
        }
    }

    // Verifica se há pelo menos um acto clínico válido
    hasValidActos(): boolean {
        return this.actosClinicos.controls.some(control => 
            control.get('tipo')?.valid && control.get('subsistemaSaude')?.valid
        );
    }

    // Método para definir o step atual ao clicar
    setStep(step: number): void {
        this.stepAtual.set(step);
    }

    // Método para ir para a home
    goHome(): void {
        this.router.navigate(['/']);
    }
}
