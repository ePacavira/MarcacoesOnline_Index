import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private appointmentService: AnonymousAppointmentService
  ) {
    this.minDate = new Date().toISOString().split('T')[0];
    this.initializeForms();
  }

  ngOnInit(): void {
    this.updateStepStatus();
  }

  private initializeForms(): void {
    // Formulário dos dados do paciente
    this.patientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      birthDate: ['', Validators.required],
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
      date: ['', Validators.required],
      time: ['', Validators.required],
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
        return this.serviceForm.valid;
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
        const dateValue = this.scheduleForm.get('date')?.value;
        const timeValue = this.scheduleForm.get('time')?.value || '';
        const notesValue = this.scheduleForm.get('notes')?.value || '';
        
        if (this.appointmentData.appointment && dateValue) {
          this.appointmentData.appointment.date = new Date(dateValue);
          this.appointmentData.appointment.time = timeValue;
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

  confirmAppointment(): void {
    if (this.validateCurrentStep()) {
      this.isLoading = true;
      this.saveStepData();
      
      // Criar a marcação usando o serviço
      this.appointmentService.createAppointment({
        patient: this.appointmentData.patient!,
        appointment: this.appointmentData.appointment!
      }).subscribe({
        next: (appointment) => {
          // Enviar confirmações
          this.appointmentService.sendConfirmationEmail(appointment).subscribe();
          this.appointmentService.sendConfirmationSMS(appointment).subscribe();
          
          // Redirecionar para página de sucesso
          this.router.navigate(['/marcacao-sucesso'], {
            queryParams: { reference: appointment.referenceCode }
          });
        },
        error: (error) => {
          console.error('Erro ao criar marcação:', error);
          // Aqui poderia mostrar uma mensagem de erro para o usuário
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
