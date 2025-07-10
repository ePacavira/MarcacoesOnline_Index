export interface AnonymousAppointment {
  // Dados do utente
  patient: {
    name: string;
    email: string;
    phone: string;
    birthDate: Date;
    address?: string;
    medicalHistory?: string;
  };
  
  // Dados da marcação
  appointment: {
    doctorId: string;
    serviceId: string;
    date: Date;
    time: string;
    notes?: string;
  };
  
  // Metadados
  createdAt: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  referenceCode: string; // Código único para identificação
}

export interface AnonymousAppointmentStep {
  step: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

export const APPOINTMENT_STEPS: AnonymousAppointmentStep[] = [
  {
    step: 1,
    title: 'Dados Pessoais',
    description: 'Informações básicas do utente',
    isCompleted: false,
    isActive: true
  },
  {
    step: 2,
    title: 'Serviço e Profissional',
    description: 'Escolha do serviço e profissional',
    isCompleted: false,
    isActive: false
  },
  {
    step: 3,
    title: 'Data e Hora',
    description: 'Agendamento da consulta',
    isCompleted: false,
    isActive: false
  },
  {
    step: 4,
    title: 'Confirmação',
    description: 'Revisão e confirmação',
    isCompleted: false,
    isActive: false
  }
]; 