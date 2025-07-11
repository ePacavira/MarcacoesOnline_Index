import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

export interface UpdateProfileRequest {
  nomeCompleto?: string;
  email?: string;
  telefone?: string;
  telemovel?: string;
  dataNascimento?: string;
  endereco?: string;
  morada?: string;
  genero?: string;
  fotoPath?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserPedidosResponse {
  id: number;
  estado: number;
  dataAgendada?: string;
  dataInicioPreferida: string;
  dataFimPreferida: string;
  horarioPreferido: string;
  observacoes: string;
  actosClinicos: {
    id: number;
    tipo: string;
    subsistemaSaude: string;
    profissional: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/User`;

  // Obter dados completos do utilizador
  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/profile`);
  }

  // Atualizar dados pessoais
  updateProfile(data: UpdateProfileRequest): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/profile`, data);
  }

  // Alterar password
  changePassword(data: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/change-password`, data);
  }

  // Upload de foto
  uploadPhoto(file: File): Observable<{ fotoPath: string }> {
    const formData = new FormData();
    formData.append('photo', file);
    return this.http.post<{ fotoPath: string }>(`${this.baseUrl}/upload-photo`, formData);
  }

  // Obter pedidos do utilizador
  getUserPedidos(): Observable<UserPedidosResponse[]> {
    return this.http.get<UserPedidosResponse[]>(`${this.baseUrl}/pedidos`);
  }

  // Obter pedido específico
  getUserPedido(id: number): Observable<UserPedidosResponse> {
    return this.http.get<UserPedidosResponse>(`${this.baseUrl}/pedidos/${id}`);
  }

  // Cancelar pedido
  cancelPedido(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/pedidos/${id}/cancel`, {});
  }

  // Obter estatísticas do utilizador
  getUserStats(): Observable<{
    totalPedidos: number;
    pedidosPendentes: number;
    pedidosConfirmados: number;
    pedidosConcluidos: number;
    pedidosCancelados: number;
  }> {
    return this.http.get<{
      totalPedidos: number;
      pedidosPendentes: number;
      pedidosConfirmados: number;
      pedidosConcluidos: number;
      pedidosCancelados: number;
    }>(`${this.baseUrl}/stats`);
  }
} 