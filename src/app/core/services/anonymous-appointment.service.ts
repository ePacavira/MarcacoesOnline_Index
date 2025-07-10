import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AnonymousAppointment } from '../models/anonymous-appointment.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnonymousAppointmentService {
  private apiUrl = `${environment.apiUrl}/anonymous-appointments`;

  constructor(private http: HttpClient) {}

  /**
   * Cria uma nova marcação anónima
   */
  createAppointment(appointment: Omit<AnonymousAppointment, 'id' | 'createdAt' | 'status' | 'referenceCode'>): Observable<AnonymousAppointment> {
    // Por enquanto, simular uma resposta
    const newAppointment: AnonymousAppointment = {
      ...appointment,
      createdAt: new Date(),
      status: 'pending',
      referenceCode: this.generateReferenceCode()
    };

    // Em produção, seria uma chamada HTTP real
    // return this.http.post<AnonymousAppointment>(this.apiUrl, appointment);
    
    return of(newAppointment);
  }

  /**
   * Busca uma marcação pelo código de referência
   */
  getAppointmentByReference(referenceCode: string): Observable<AnonymousAppointment | null> {
    // Simular busca
    const mockAppointment: AnonymousAppointment = {
      patient: {
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '912345678',
        birthDate: new Date('1990-01-01'),
        address: 'Rua das Flores, 123',
        medicalHistory: 'Nenhuma condição conhecida'
      },
      appointment: {
        doctorId: '1',
        serviceId: '1',
        date: new Date('2024-01-15'),
        time: '10:00',
        notes: 'Primeira consulta'
      },
      createdAt: new Date(),
      status: 'pending',
      referenceCode: referenceCode
    };

    return of(mockAppointment);
  }

  /**
   * Atualiza o status de uma marcação
   */
  updateAppointmentStatus(referenceCode: string, status: 'pending' | 'confirmed' | 'cancelled'): Observable<AnonymousAppointment> {
    // Simular atualização
    const updatedAppointment: AnonymousAppointment = {
      patient: {
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '912345678',
        birthDate: new Date('1990-01-01'),
        address: 'Rua das Flores, 123',
        medicalHistory: 'Nenhuma condição conhecida'
      },
      appointment: {
        doctorId: '1',
        serviceId: '1',
        date: new Date('2024-01-15'),
        time: '10:00',
        notes: 'Primeira consulta'
      },
      createdAt: new Date(),
      status: status,
      referenceCode: referenceCode
    };

    return of(updatedAppointment);
  }

  /**
   * Cancela uma marcação
   */
  cancelAppointment(referenceCode: string): Observable<AnonymousAppointment> {
    return this.updateAppointmentStatus(referenceCode, 'cancelled');
  }

  /**
   * Confirma uma marcação
   */
  confirmAppointment(referenceCode: string): Observable<AnonymousAppointment> {
    return this.updateAppointmentStatus(referenceCode, 'confirmed');
  }

  /**
   * Gera um código de referência único
   */
  private generateReferenceCode(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `MAR${timestamp}${random}`.toUpperCase();
  }

  /**
   * Valida se um código de referência é válido
   */
  validateReferenceCode(code: string): boolean {
    // Código deve ter pelo menos 10 caracteres e começar com MAR
    return code.length >= 10 && code.startsWith('MAR');
  }

  /**
   * Envia email de confirmação
   */
  sendConfirmationEmail(appointment: AnonymousAppointment): Observable<boolean> {
    // Simular envio de email
    console.log('Enviando email de confirmação para:', appointment.patient.email);
    return of(true);
  }

  /**
   * Envia SMS de confirmação
   */
  sendConfirmationSMS(appointment: AnonymousAppointment): Observable<boolean> {
    // Simular envio de SMS
    console.log('Enviando SMS de confirmação para:', appointment.patient.phone);
    return of(true);
  }
} 