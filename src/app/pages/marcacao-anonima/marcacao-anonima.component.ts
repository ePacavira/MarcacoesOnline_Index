import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AnonymousAppointment, AnonymousAppointmentStep, APPOINTMENT_STEPS } from '../../core/models/anonymous-appointment.model';
import { AnonymousAppointmentService } from '../../core/services/anonymous-appointment.service';
import { UsersService } from '../../core/services/users.service';
import { ValidatorFn, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-marcacao-anonima',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './marcacao-anonima.component.html',
  styleUrls: ['./marcacao-anonima.component.css']
})
export class MarcacaoAnonimaComponent implements OnInit {
  currentStep = 1;
  steps: AnonymousAppointmentStep[] = APPOINTMENT_STEPS;
  isLoading = false;
  minDate: string;
  
  // Formulários para cada step
  patientForm!: FormGroup;
  serviceForm!: FormGroup;
  scheduleForm!: FormGroup;
  actosClinicosForm: FormArray;
  
  // Dados temporários
  appointmentData: Partial<AnonymousAppointment> = {
    appointment: {
      doctorId: '',
      serviceId: '',
      date: new Date(),
      time: '',
      notes: ''
    }
  };
  
  // Dados mock para demonstração
  services = [
    { id: '1', name: 'Consulta Geral', description: 'Consulta médica geral', duration: 30, price: 50 },
    { id: '2', name: 'Cardiologia', description: 'Consulta de cardiologia', duration: 45, price: 80 },
    { id: '3', name: 'Dermatologia', description: 'Consulta de dermatologia', duration: 30, price: 70 },
    { id: '4', name: 'Pediatria', description: 'Consulta de pediatria', duration: 30, price: 60 },
    { id: '5', name: 'Ortopedia', description: 'Consulta de ortopedia', duration: 45, price: 80 },
    { id: '6', name: 'Ginecologia', description: 'Consulta de ginecologia', duration: 45, price: 80 },
    { id: '7', name: 'Neurologia', description: 'Consulta de neurologia', duration: 60, price: 100 },
    { id: '8', name: 'Psiquiatria', description: 'Consulta de psiquiatria', duration: 60, price: 100 },
    { id: '9', name: 'Oftalmologia', description: 'Consulta de oftalmologia', duration: 30, price: 70 },
    { id: '10', name: 'Endocrinologia', description: 'Consulta de endocrinologia', duration: 45, price: 80 },
    { id: '11', name: 'Raio-X', description: 'Exame de raio-x', duration: 30, price: 50 },
    { id: '12', name: 'Análises Sanguíneas', description: 'Análises de sangue', duration: 15, price: 30 }
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
  
  availableSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  dataInicioPreferida: string = '';
  dataFimPreferida: string = '';
  horarioPreferido: string = '';

  isValidatingEmail = false;

  // Validador customizado para data/hora início <= data/hora fim
  agendamentoIntervaloValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const dataInicio = group.get('dataInicioPreferida')?.value;
    const horaInicio = group.get('horaInicioPreferida')?.value;
    const dataFim = group.get('dataFimPreferida')?.value;
    const horaFim = group.get('horaFimPreferida')?.value;

    if (!dataInicio || !horaInicio || !dataFim || !horaFim) return null;

    const inicio = new Date(`${dataInicio}T${horaInicio}:00`);
    const fim = new Date(`${dataFim}T${horaFim}:00`);

    return inicio > fim ? { intervaloInvalido: true } : null;
  };

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private appointmentService: AnonymousAppointmentService,
    private usersService: UsersService
  ) {
    this.minDate = new Date().toISOString().split('T')[0];
    this.initializeForms();
    this.actosClinicosForm = this.fb.array([
      this.createActoClinicoGroup()
    ]);
  }

  createActoClinicoGroup(): FormGroup {
    return this.fb.group({
      tipo: ['', Validators.required],
      subsistemaSaude: ['', Validators.required],
      profissional: ['', Validators.required]
    });
  }

  addActoClinico() {
    this.actosClinicosForm.push(this.createActoClinicoGroup());
  }

  removeActoClinico(index: number) {
    if (this.actosClinicosForm.length > 1) {
      this.actosClinicosForm.removeAt(index);
    }
  }

  ngOnInit(): void {
    // Debug: verificar se os serviços estão carregados
    console.log('Services carregados:', this.services);
    console.log('Doctors carregados:', this.doctors);
    
    // Gerar número de utente aleatório (exemplo)
    const numeroUtente = Math.floor(100000000 + Math.random() * 900000000).toString();
    this.patientForm.get('numeroUtente')?.setValue(numeroUtente);
    this.patientForm.get('numeroUtente')?.updateValueAndValidity();
    this.patientForm.updateValueAndValidity();
    this.updateStepStatus();
  }

  // Validador assíncrono para email único
  emailUnicoValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return Promise.resolve(null);
      return this.usersService.existsEmail(control.value).pipe(
        map(res => res.exists ? { emailJaExiste: (res as any).message || 'Este email já está em uso.' } : null)
      );
    };
  }

  // Validador assíncrono para telemóvel único
  telemovelUnicoValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return Promise.resolve(null);
      return this.usersService.existsTelemovel(control.value).pipe(
        map(res => res.exists ? { telemovelJaExiste: (res as any).message || 'Este telemóvel já está em uso.' } : null)
      );
    };
  }

  // Validador síncrono para idade mínima (ex: 18 anos)
  idadeMinimaValidator(idadeMinima: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const data = new Date(control.value);
      const hoje = new Date();
      let idade = hoje.getFullYear() - data.getFullYear();
      const m = hoje.getMonth() - data.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < data.getDate())) {
        idade--;
      }
      return idade < idadeMinima ? { idadeMinima: true } : null;
    };
  }

  private initializeForms(): void {
    // Formulário dos dados do paciente
    this.patientForm = this.fb.group({
      numeroUtente: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email], [this.emailUnicoValidator()]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)], [this.telemovelUnicoValidator()]],
      birthDate: ['', [Validators.required, this.idadeMinimaValidator(18)]],
      genero: ['', Validators.required],
      address: [''],
      medicalHistory: ['']
    });

    // Formulário do serviço e profissional
    this.serviceForm = this.fb.group({
      serviceId: ['', Validators.required],
      doctorId: ['', Validators.required]
    });

    // Formulário da data e hora
    this.scheduleForm = this.fb.group({
      dataInicioPreferida: ['', Validators.required],
      horaInicioPreferida: ['', Validators.required],
      dataFimPreferida: ['', Validators.required],
      horaFimPreferida: ['', Validators.required],
      notes: ['']
    }, { validators: this.agendamentoIntervaloValidator });
  }

  async nextStep(): Promise<void> {
    if (this.currentStep === 1) {
      this.patientForm.markAllAsTouched();
      this.patientForm.updateValueAndValidity();

      // Ativa loading
      this.isValidatingEmail = true;

      // Aguarda a validação assíncrona terminar
      if (this.patientForm.pending) {
        await new Promise(resolve => {
          const sub = this.patientForm.statusChanges.subscribe(status => {
            if (status !== 'PENDING') {
              sub.unsubscribe();
              resolve(null);
            }
          });
        });
      }

      // Desativa loading
      this.isValidatingEmail = false;

      // Checa explicitamente o status do campo de email
      const emailControl = this.patientForm.get('email');
      if (emailControl && emailControl.invalid) {
        return;
      }

      if (this.patientForm.valid) {
        this.saveStepData();
        if (this.currentStep < this.steps.length) {
          this.currentStep++;
          this.updateStepStatus();
        }
      }
      return;
    }
    if (this.validateCurrentStep()) {
      this.saveStepData();
      if (this.currentStep < this.steps.length) {
        this.currentStep++;
        this.updateStepStatus();
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStepStatus();
    }
  }

  validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.patientForm.valid;
      case 2:
        return this.actosClinicosForm.valid;
      case 3:
        return this.scheduleForm.valid;
      default:
        return true;
    }
  }

  private saveStepData(): void {
    switch (this.currentStep) {
      case 1:
        this.appointmentData.patient = this.patientForm.value;
        break;
      case 2:
        const serviceId = this.serviceForm.get('serviceId')?.value || '';
        const doctorId = this.serviceForm.get('doctorId')?.value || '';
        if (this.appointmentData.appointment) {
          this.appointmentData.appointment.serviceId = serviceId;
          this.appointmentData.appointment.doctorId = doctorId;
        }
        break;
      case 3:
        this.dataInicioPreferida = this.scheduleForm.get('dataInicioPreferida')?.value + 'T' + this.scheduleForm.get('horaInicioPreferida')?.value;
        this.dataFimPreferida = this.scheduleForm.get('dataFimPreferida')?.value + 'T' + this.scheduleForm.get('horaFimPreferida')?.value;
        const notesValue = this.scheduleForm.get('notes')?.value || '';
        if (this.appointmentData.appointment) {
          this.appointmentData.appointment.notes = notesValue;
        }
        break;
    }
  }

  private updateStepStatus(): void {
    this.steps.forEach((step, index) => {
      step.isActive = step.step === this.currentStep;
      step.isCompleted = step.step < this.currentStep;
    });
  }

  // Função para garantir formato ISO com segundos
  private formatDateTime(date: string): string {
    return date && date.length === 16 ? date + ':00' : date;
  }

  confirmAppointment(): void {
    if (this.validateCurrentStep()) {
      this.isLoading = true;
      this.saveStepData();
      // Montar DTO exatamente como o backend espera
      const dto = {
        numeroUtente: this.patientForm.get('numeroUtente')?.value || '',
        nomeCompleto: this.patientForm.get('name')?.value,
        dataNascimento: this.patientForm.get('birthDate')?.value,
        genero: this.patientForm.get('genero')?.value,
        telemovel: this.patientForm.get('phone')?.value,
        email: this.patientForm.get('email')?.value,
        morada: this.patientForm.get('address')?.value,
        dataInicioPreferida: this.formatDateTime(this.dataInicioPreferida),
        dataFimPreferida: this.formatDateTime(this.dataFimPreferida),
        horarioPreferido: this.horarioPreferido || 'Manhã',
        observacoes: this.appointmentData.appointment?.notes || '',
        actosClinicos: this.actosClinicosForm.value
      };
      console.log('Enviando DTO para backend:', dto);
      this.appointmentService.createAppointment(dto).subscribe({
        next: (appointment) => {
          console.log('Resposta do backend:', appointment);
          // Guardar a resposta completa para exibição imediata
          this.appointmentData = {
            patient: {
              name: appointment.nomeCompleto || appointment.nome || appointment.name,
              email: appointment.email,
              phone: appointment.telemovel || appointment.telefone || appointment.phone,
              birthDate: appointment.dataNascimento || appointment.birthDate,
              address: appointment.morada || appointment.address
            },
            appointment: {
              doctorId: appointment.doctorId || '',
              serviceId: appointment.serviceId || '',
              date: appointment.dataInicioPreferida || appointment.date,
              time: appointment.horaInicioPreferida || appointment.time,
              notes: appointment.observacoes || appointment.notes
            },
            createdAt: appointment.createdAt || new Date(),
            status: appointment.status,
            referenceCode: appointment.referenceCode || appointment.codigoReferencia
          };
          const ref = appointment.referenceCode || appointment.codigoReferencia;
          if (appointment && ref) {
            // Navega imediatamente para a tela de sucesso
          this.router.navigate(['/marcacao-sucesso'], {
              queryParams: { reference: ref }
            });
            // Tenta enviar email/SMS, mas não bloqueia a navegação
            try {
              this.appointmentService.sendConfirmationEmail(appointment).subscribe({
                error: (e) => console.error('Erro ao enviar email:', e)
              });
              this.appointmentService.sendConfirmationSMS(appointment).subscribe({
                error: (e) => console.error('Erro ao enviar SMS:', e)
              });
            } catch (e) {
              console.error('Erro ao tentar enviar email/SMS:', e);
            }
          } else {
            alert('Marcação criada mas não foi possível obter o código de referência.');
          }
        },
        error: (error) => {
          console.error('Erro ao criar marcação:', error);
          alert('Erro ao criar marcação: ' + (error?.message || error));
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  getSelectedService() {
    const serviceId = this.serviceForm.get('serviceId')?.value;
    return this.services.find(s => s.id === serviceId) || null;
  }

  getSelectedDoctor() {
    const doctorId = this.serviceForm.get('doctorId')?.value;
    return this.doctors.find(d => d.id === doctorId) || null;
  }

  getSelectedDate() {
    const date = this.scheduleForm.get('date')?.value;
    return date ? new Date(date).toLocaleDateString('pt-BR') : '';
  }

  // Métodos auxiliares para validação
  isFieldInvalid(fieldName: string, form: FormGroup): boolean {
    const field = form.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getFieldError(fieldName: string, form: FormGroup): string {
    const field = form.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Este campo é obrigatório';
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) return 'Formato inválido';
    }
    return '';
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

  // Método para formatar o nome do profissional com especialidade
  formatarProfissional(doctor: any): string {
    return `${doctor.name} - ${doctor.specialty}`;
  }

  // Método para atualizar profissionais quando o tipo de consulta muda
  onTipoConsultaChange(actoIndex: number): void {
    const actoControl = this.actosClinicosForm.at(actoIndex);
    const tipoConsulta = actoControl.get('tipo')?.value;
    
    // Limpar a seleção do profissional quando o tipo muda
    actoControl.get('profissional')?.setValue('');
    
    // Debug: mostrar profissionais recomendados
    if (tipoConsulta) {
      const profissionaisRecomendados = this.getProfissionaisRecomendados(tipoConsulta);
      console.log(`Profissionais recomendados para ${tipoConsulta}:`, profissionaisRecomendados);
    }
  }
}
