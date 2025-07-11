import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AnonymousAppointment, AnonymousAppointmentStep, APPOINTMENT_STEPS } from '../../core/models/anonymous-appointment.model';
import { AnonymousAppointmentService } from '../../core/services/anonymous-appointment.service';

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
    { id: '2', name: 'Consulta Especializada', description: 'Consulta com especialista', duration: 45, price: 80 },
    { id: '3', name: 'Exame Clínico', description: 'Exame físico completo', duration: 60, price: 100 }
  ];
  
  doctors = [
    { id: '1', name: 'Dr. João Silva', specialty: 'Medicina Geral', crm: '12345' },
    { id: '2', name: 'Dra. Maria Santos', specialty: 'Cardiologia', crm: '67890' },
    { id: '3', name: 'Dr. Pedro Costa', specialty: 'Dermatologia', crm: '11111' }
  ];
  
  availableSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  dataInicioPreferida: string = '';
  dataFimPreferida: string = '';
  horarioPreferido: string = '';

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private appointmentService: AnonymousAppointmentService
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
    // Gerar número de utente aleatório (exemplo)
    const numeroUtente = Math.floor(100000000 + Math.random() * 900000000).toString();
    this.patientForm.get('numeroUtente')?.setValue(numeroUtente);
    this.patientForm.get('numeroUtente')?.updateValueAndValidity();
    this.patientForm.updateValueAndValidity();
    this.updateStepStatus();
  }

  private initializeForms(): void {
    // Formulário dos dados do paciente
    this.patientForm = this.fb.group({
      numeroUtente: [{ value: '', disabled: true }], // sem Validators.required
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      birthDate: ['', Validators.required],
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
    });
  }

  nextStep(): void {
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
}
