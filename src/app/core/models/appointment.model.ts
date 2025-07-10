export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  serviceId: string
  date: Date
  time: string
  status: AppointmentStatus
  notes?: string
  patient?: Patient
  doctor?: Doctor
  service?: Service
  createdAt: Date
  updatedAt: Date
}

export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show",
}

export interface Patient {
  id: string
  name: string
  email: string
  phone: string
  birthDate: Date
  address?: string
  medicalHistory?: string
}

export interface Doctor {
  id: string
  name: string
  specialty: string
  crm: string
  email: string
  phone: string
  schedule: DoctorSchedule[]
}

export interface DoctorSchedule {
  dayOfWeek: number
  startTime: string
  endTime: string
  isAvailable: boolean
}

export interface Service {
  id: string
  name: string
  description: string
  duration: number // em minutos
  price: number
  isActive: boolean
}
