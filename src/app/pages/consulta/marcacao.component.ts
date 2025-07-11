import { Component, signal, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreatePedidoMarcacao } from '../../models/marcacao.interface';
import { MarcacaoService } from '../../core/services/marcacao';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-consulta',
    imports: [ReactiveFormsModule],
    templateUrl: './marcacao.component.html',
    styleUrl: './marcacao.component.css'
})
export class ConsultaComponent {
    marcacaoForm!: FormGroup;
    private marcacaoService = inject(MarcacaoService);
    private authService = inject(AuthService);
    
    utenteLogado = { // Simulação
        nome: 'Kambaia L. Alberto',
        numero: '987654321'
    };

    constructor(
        private fb: FormBuilder,
        private router: Router
    ) { }
    
    isLoading = signal(false);
    errorMessage = signal("");
    successMessage = signal("");
    
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
        console.log("Adicionando acto clínico");
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
        console.log('Submetendo marcação:', this.marcacaoForm.value);
        
        if (this.marcacaoForm.valid) {
            this.isLoading.set(true);
            this.errorMessage.set("");
            this.successMessage.set("");

            const formData = this.marcacaoForm.value;
            
            // Preparar dados para enviar para a API no formato correto
            const pedidoMarcacao: CreatePedidoMarcacao = {
                estado: 0, // 0 = Pendente
                dataInicioPreferida: formData.dataInicioPreferida,
                dataFimPreferida: formData.dataFimPreferida,
                horarioPreferido: formData.horarioPreferido,
                observacoes: formData.observacoes || '',
                // Se o utilizador estiver logado, incluir o ID
                userId: this.authService.getCurrentUser()?.id,
                actosClinicos: formData.actosClinicos.map((acto: any) => ({
                    tipo: acto.tipo,
                    subsistemaSaude: acto.subsistemaSaude,
                    profissional: acto.profissional || ''
                }))
            };

            console.log('Dados a enviar para API:', pedidoMarcacao);

            // Enviar para a API
            this.marcacaoService.createMarcacao(pedidoMarcacao).subscribe({
                next: (response) => {
                    this.isLoading.set(false);
                    this.successMessage.set("Marcação criada com sucesso!");
                    console.log('Marcação criada:', response);
                    
                    // Limpar formulário
                    this.marcacaoForm.reset();
                    while (this.actosClinicos.length !== 0) { 
                        this.actosClinicos.removeAt(0); 
                    }
                    this.adicionarActoClinico();
                    this.stepAtual.set(0);
                    
                    // Redirecionar para página de sucesso ou dashboard
                    setTimeout(() => {
                        if (this.authService.isAuthenticated()) {
                            // Se estiver logado, ir para o dashboard correspondente
                            if (this.authService.isUtente()) {
                                this.router.navigate(['/utente/dashboard']);
                            } else if (this.authService.isAdmin() || this.authService.isAdministrativo()) {
                                this.router.navigate(['/admintr/dashboard']);
                            } else {
                                this.router.navigate(['/']);
                            }
                        } else {
                            // Se não estiver logado, ir para página de sucesso
                            this.router.navigate(['/marcacao-sucesso']);
                        }
                    }, 2000);
                },
                error: (error) => {
                    this.isLoading.set(false);
                    console.error('Erro ao criar marcação:', error);
                    
                    if (error.status === 401) {
                        this.errorMessage.set("Sessão expirada. Por favor, faça login novamente.");
                    } else if (error.status === 400) {
                        this.errorMessage.set("Dados inválidos. Verifique as informações inseridas.");
                        console.error('Detalhes do erro:', error.error);
                    } else if (error.status === 0) {
                        this.errorMessage.set("Erro de conexão. Verifique se a API está a funcionar.");
                    } else {
                        this.errorMessage.set("Erro ao criar marcação. Tente novamente.");
                    }
                }
            });
        } else {
            this.errorMessage.set("Por favor, preencha todos os campos obrigatórios.");
        }
    }

    // Step: Volta para Actos Clínicos ao clicar no cancelar
    onCancelMarcacao(): void {
        this.marcacaoForm.reset();
        while (this.actosClinicos.length !== 0) { this.actosClinicos.removeAt(0); }
        this.adicionarActoClinico();
        this.stepAtual.set(0); // Volta para Actos Clínicos
        this.errorMessage.set("");
        this.successMessage.set("");
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
