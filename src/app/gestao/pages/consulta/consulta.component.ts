import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PedidoMarcacao } from '../../../models/marcacao.interface';

@Component({
    selector: 'app-consulta',
    imports: [ReactiveFormsModule],
    templateUrl: './consulta.component.html',
})
export class ConsultaComponent {
    marcacaoForm!: FormGroup;

    utenteLogado = { // Simulação
        nome: 'Kambaia L. Alberto',
        numero: '987654321'
    };

    constructor(
        private fb: FormBuilder,
        private router: Router // Adicione esta linha
    ) { }

    ngOnInit(): void {

        this.marcacaoForm = this.fb.group({
            actosClinicos: this.fb.array([]), // Se inicializar como um array vazio, nada aparecerá inicialmente
            dataInicio: ['', Validators.required],
            dataFim: ['', Validators.required],
            horarioSolicitado: ['', Validators.required],
            observacoesAdicionais: [''],
        });
        this.adicionarActoClinico();
    }

    get actosClinicos(): FormArray {
        return this.marcacaoForm.get('actosClinicos') as FormArray;
    }

    novoActoClinico(): FormGroup {
        return this.fb.group({
            tipoConsultaExame: ['', Validators.required],
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
        if (this.marcacaoForm.valid) {
            const marcacaoData: PedidoMarcacao = {
                actosClinicos: this.marcacaoForm.value.actosClinicos,
                dataInicioPreferida: this.marcacaoForm.value.dataInicioPreferida,
                dataFimPreferida: this.marcacaoForm.value.dataFimPreferida,
                horarioPreferido: this.marcacaoForm.value.dataInicioPreferida,
                observacoes: this.marcacaoForm.value.observacoesAdicionais,
            };
            console.log('Dados da Marcação:', marcacaoData);
            
            this.router.navigate(['/utente']); // PASSO 3: Navegar para a rota /utente
            alert('Marcação solicitada! Verifique a consola.');
        } else {
            console.error('Formulário de marcação inválido');
            this.marcacaoForm.markAllAsTouched();
        }
    }

    onCancelMarcacao(): void {
        this.marcacaoForm.reset();
        while (this.actosClinicos.length !== 0) { this.actosClinicos.removeAt(0); }
        this.adicionarActoClinico();
        console.log('Marcação cancelada/limpa.');
    }
}
