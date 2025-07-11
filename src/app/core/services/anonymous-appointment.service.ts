import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AnonymousAppointment } from '../models/anonymous-appointment.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnonymousAppointmentService {
  private apiUrl = `${environment.apiUrl}/PedidoMarcacao`;

  constructor(private http: HttpClient) {}

  // Criar marcação anónima
  createAppointment(dto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/anonimo`, dto);
  }

  // Consultar marcação por código
  getAppointmentByReference(referenceCode: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/consulta-marcacao/${referenceCode}`);
  }

  // Cancelar marcação por código
  cancelAppointment(referenceCode: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/consulta-marcacao/${referenceCode}/cancelar`, {});
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