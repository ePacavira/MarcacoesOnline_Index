import { Component, signal, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreatePedidoMarcacao } from '../../models/marcacao.interface';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-consulta',
    imports: [ReactiveFormsModule],
    templateUrl: './marcacao.component.html',
    styleUrl: './marcacao.component.css'
})
export class ConsultaComponent {
    marcacaoForm!: FormGroup;
    private authService = inject(AuthService);
    
    utenteLogado = {
        nome: 'Kambaia L. Alberto',
        numero: '987654321'
    };

    availableSlots: string[] = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];

    services = [
        { id: '1', name: 'Consulta Geral' },
        { id: '2', name: 'Consulta Especializada' },
        { id: '3', name: 'Exame Clínico' }
    ];

    subsistemas = [
        { value: 'SNS', label: 'SNS' },
        { value: 'ADSE', label: 'ADSE' },
        { value: 'SAMS', label: 'SAMS' },
        { value: 'Multicare', label: 'Multicare' },
        { value: 'Médis', label: 'Médis' },
        { value: 'Outro', label: 'Outro' }
    ];

    doctors = [
        // Medicina Geral (3 profissionais)
        { id: '1', name: 'Dr. João Silva', specialty: 'Medicina Geral' },
        { id: '2', name: 'Dra. Ana Costa', specialty: 'Medicina Geral' },
        { id: '3', name: 'Dr. Manuel Santos', specialty: 'Medicina Geral' },
        
        // Cardiologia (3 profissionais)
        { id: '4', name: 'Dra. Maria Santos', specialty: 'Cardiologia' },
        { id: '5', name: 'Dr. António Cardoso', specialty: 'Cardiologia' },
        { id: '6', name: 'Dra. Sofia Almeida', specialty: 'Cardiologia' },
        
        // Dermatologia (3 profissionais)
        { id: '7', name: 'Dr. Pedro Costa', specialty: 'Dermatologia' },
        { id: '8', name: 'Dra. Isabel Ferreira', specialty: 'Dermatologia' },
        { id: '9', name: 'Dr. Ricardo Martins', specialty: 'Dermatologia' },
        
        // Pediatria (3 profissionais)
        { id: '10', name: 'Dra. Ana Oliveira', specialty: 'Pediatria' },
        { id: '11', name: 'Dr. Francisco Lima', specialty: 'Pediatria' },
        { id: '12', name: 'Dra. Catarina Silva', specialty: 'Pediatria' },
        
        // Ortopedia (3 profissionais)
        { id: '13', name: 'Dr. Carlos Ferreira', specialty: 'Ortopedia' },
        { id: '14', name: 'Dra. Margarida Santos', specialty: 'Ortopedia' },
        { id: '15', name: 'Dr. Luís Pereira', specialty: 'Ortopedia' },
        
        // Ginecologia (3 profissionais)
        { id: '16', name: 'Dra. Sofia Martins', specialty: 'Ginecologia' },
        { id: '17', name: 'Dr. José Oliveira', specialty: 'Ginecologia' },
        { id: '18', name: 'Dra. Filipa Costa', specialty: 'Ginecologia' },
        
        // Neurologia (3 profissionais)
        { id: '19', name: 'Dr. Miguel Rodrigues', specialty: 'Neurologia' },
        { id: '20', name: 'Dra. Teresa Alves', specialty: 'Neurologia' },
        { id: '21', name: 'Dr. Paulo Silva', specialty: 'Neurologia' },
        
        // Psiquiatria (3 profissionais)
        { id: '22', name: 'Dra. Inês Pereira', specialty: 'Psiquiatria' },
        { id: '23', name: 'Dr. André Santos', specialty: 'Psiquiatria' },
        { id: '24', name: 'Dra. Mariana Costa', specialty: 'Psiquiatria' },
        
        // Oftalmologia (3 profissionais)
        { id: '25', name: 'Dr. António Santos', specialty: 'Oftalmologia' },
        { id: '26', name: 'Dra. Helena Ferreira', specialty: 'Oftalmologia' },
        { id: '27', name: 'Dr. Diogo Martins', specialty: 'Oftalmologia' },
        
        // Endocrinologia (3 profissionais)
        { id: '28', name: 'Dra. Teresa Costa', specialty: 'Endocrinologia' },
        { id: '29', name: 'Dr. Roberto Silva', specialty: 'Endocrinologia' },
        { id: '30', name: 'Dra. Joana Oliveira', specialty: 'Endocrinologia' }
    ];

    constructor(
        private fb: FormBuilder,
        private router: Router
    ) { }
    
    isLoading = signal(false);
    errorMessage = signal("");
    successMessage = signal("");
    
    stepAtual = signal(0);
    
    ngOnInit(): void {
        this.marcacaoForm = this.fb.group({
            actosClinicos: this.fb.array([]),
            dataInicioPreferida: ['', Validators.required],
            horaInicioPreferida: ['', Validators.required],
            dataFimPreferida: ['', Validators.required],
            horaFimPreferida: ['', Validators.required],
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
            this.isLoading.set(true);
            this.errorMessage.set("");
            this.successMessage.set("");

            const formData = this.marcacaoForm.value;
            // Montar datas no formato "YYYY-MM-DDTHH:mm:ss" (sem o Z)
            const dataInicio = formData.dataInicioPreferida && formData.horaInicioPreferida
                ? `${formData.dataInicioPreferida}T${formData.horaInicioPreferida}:00`
                : "";
            const dataFim = formData.dataFimPreferida && formData.horaFimPreferida
                ? `${formData.dataFimPreferida}T${formData.horaFimPreferida}:00`
                : "";
            const pedidoMarcacao = {
                estado: 0,
                dataInicioPreferida: dataInicio,
                dataFimPreferida: dataFim,
                horarioPreferido: `${formData.horaInicioPreferida} - ${formData.horaFimPreferida}` || "",
                observacoes: formData.observacoes || "",
                actosClinicos: formData.actosClinicos.map((acto: any) => ({
                    tipo: acto.tipo || "",
                    subsistemaSaude: acto.subsistemaSaude || "",
                    profissional: acto.profissional || ""
                }))
            };

            // Remover métodos que usam marcacaoService
            // this.marcacaoService.createMarcacao(pedidoMarcacao as any).subscribe({
            //     next: (response) => {
            //         this.isLoading.set(false);
            //         this.successMessage.set("Marcação criada com sucesso!");
            //         this.marcacaoForm.reset();
            //         while (this.actosClinicos.length !== 0) { 
            //             this.actosClinicos.removeAt(0); 
            //         }
            //         this.adicionarActoClinico();
            //         this.stepAtual.set(0);
            //         setTimeout(() => {
            //             if (this.authService.isAuthenticated()) {
            //                 if (this.authService.isUtente()) {
            //                     this.router.navigate(['/utente/dashboard']);
            //                 } else if (this.authService.isAdmin() || this.authService.isAdministrativo()) {
            //                     this.router.navigate(['/admintr/dashboard']);
            //                 } else {
            //                     this.router.navigate(['/']);
            //                 }
            //             } else {
            //                 this.router.navigate(['/marcacao-sucesso']);
            //             }
            //         }, 2000);
            //     },
            //     error: (error) => {
            //         this.isLoading.set(false);
            //         // Mensagem padrão
            //         let mensagem = "Erro ao criar marcação. Tente novamente.";
            //         if (error.status === 401) {
            //             mensagem = "Sessão expirada. Por favor, faça login novamente.";
            //         } else if (error.status === 400) {
            //             mensagem = "Dados inválidos. Verifique as informações inseridas.";
            //         } else if (error.status === 0) {
            //             mensagem = "Erro de conexão. Verifique se a API está a funcionar.";
            //         } else if (error.status === 500 && error.error && typeof error.error === 'string' && error.error.includes('Já existe uma marcação para este utilizador')) {
            //             mensagem = "Já existe uma marcação para este utilizador nesse intervalo de datas. Por favor, escolha outro período.";
            //         }
            //         this.errorMessage.set(mensagem);
            //     }
            // });
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

    // Método para obter profissionais por especialidade
    getProfissionaisPorEspecialidade(especialidade: string): any[] {
        return this.doctors.filter(doctor => doctor.specialty === especialidade);
    }

    // Método para obter todas as especialidades únicas
    getEspecialidades(): string[] {
        return [...new Set(this.doctors.map(doctor => doctor.specialty))];
    }

    // Método para formatar o nome do profissional com especialidade
    formatarProfissional(doctor: any): string {
        return `${doctor.name} - ${doctor.specialty}`;
    }

    // Método para obter profissionais recomendados baseado no tipo de consulta
    getProfissionaisRecomendados(tipoConsulta: string): any[] {
        const mapeamentoEspecialidades: { [key: string]: string[] } = {
            'Consulta Geral': ['Medicina Geral'],
            'Cardiologia': ['Cardiologia'],
            'Dermatologia': ['Dermatologia'],
            'Pediatria': ['Pediatria'],
            'Ortopedia': ['Ortopedia'],
            'Ginecologia': ['Ginecologia'],
            'Neurologia': ['Neurologia'],
            'Psiquiatria': ['Psiquiatria'],
            'Oftalmologia': ['Oftalmologia'],
            'Endocrinologia': ['Endocrinologia'],
            'Raio-X': ['Medicina Geral', 'Ortopedia', 'Cardiologia'],
            'Análises Sanguíneas': ['Medicina Geral', 'Endocrinologia', 'Cardiologia']
        };

        const especialidadesRecomendadas = mapeamentoEspecialidades[tipoConsulta] || ['Medicina Geral'];
        return this.doctors.filter(doctor => especialidadesRecomendadas.includes(doctor.specialty));
    }

    // Método para atualizar profissionais quando o tipo de consulta muda
    onTipoConsultaChange(actoIndex: number): void {
        const actoControl = this.actosClinicos.at(actoIndex);
        const tipoConsulta = actoControl.get('tipo')?.value;
        
        // Limpar a seleção do profissional quando o tipo muda
        actoControl.get('profissional')?.setValue('');
        
        // Se quiseres, podes adicionar lógica adicional aqui
        // como mostrar apenas profissionais recomendados para o tipo selecionado
    }
}
