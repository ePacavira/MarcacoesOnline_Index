import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { tap } from 'rxjs/operators';

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
    return this.http.get<User>(`${this.baseUrl}/me`);
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
  uploadPhoto(file: File, userId: number): Observable<{ fotoPath: string }> {
    // Se a sincronização está desativada, retornar erro 404
    if (!environment.enablePhotoSync) {
      return new Observable(observer => {
        observer.error({ status: 404, message: 'Endpoint de upload não disponível' });
      });
    }

    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ fotoPath: string }>(`${this.baseUrl}/${userId}/foto`, formData);
  }

  // Obter pedidos do utilizador
  getUserPedidos(): Observable<UserPedidosResponse[]> {
    return this.http.get<UserPedidosResponse[]>(`${this.baseUrl}/pedidos`);
  }

  // Obter pedido específico
  getUserPedido(id: number): Observable<UserPedidosResponse> {
    return this.http.get<UserPedidosResponse>(`${this.baseUrl}/pedidos/${id}`);
  }

  // Cancelar pedido (DELETE)
  cancelPedido(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/pedidos/${id}/cancelar`);
  }

  // Apagar pedido (marcação)
  deletePedido(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/pedidos/${id}`);
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

  // Excluir utilizador
  deleteUser(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // ===== MÉTODOS PARA GESTÃO LOCAL DE FOTOS =====

  // Guardar foto no localStorage
  savePhotoLocally(userId: number, photoData: string): void {
    const key = `user_photo_${userId}`;
    try {
      localStorage.setItem(key, photoData);
      console.log('Foto guardada localmente para o utilizador:', userId);
    } catch (error) {
      console.error('Erro ao guardar foto localmente:', error);
    }
  }

  // Obter foto do localStorage
  getPhotoLocally(userId: number): string | null {
    const key = `user_photo_${userId}`;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Erro ao obter foto localmente:', error);
      return null;
    }
  }

  // Remover foto do localStorage
  removePhotoLocally(userId: number): void {
    const key = `user_photo_${userId}`;
    try {
      localStorage.removeItem(key);
      console.log('Foto removida localmente para o utilizador:', userId);
    } catch (error) {
      console.error('Erro ao remover foto localmente:', error);
    }
  }

  // Atualizar perfil com foto (incluindo persistência local)
  updateProfileWithPhoto(data: UpdateProfileRequest, userId: number): Observable<User> {
    // Se há uma foto base64, guardar localmente
    if (data.fotoPath && data.fotoPath.startsWith('data:image/')) {
      this.savePhotoLocally(userId, data.fotoPath);
    }
    
    return this.updateProfile(data);
  }

  // Obter foto do utilizador (tenta servidor primeiro, depois localStorage)
  getUserPhoto(userId: number): string | null {
    // Primeiro tenta obter do localStorage
    const localPhoto = this.getPhotoLocally(userId);
    if (localPhoto) {
      return localPhoto;
    }
    
    // Se não há foto local, retorna null (usará avatar padrão)
    return null;
  }

  // Sincronizar fotos do localStorage com o backend
  syncPhotosWithBackend(userId: number): Observable<any> {
    const localPhoto = this.getPhotoLocally(userId);
    
    if (!localPhoto) {
      // Se não há foto local, não há nada para sincronizar
      return new Observable(observer => {
        observer.next({ message: 'Nenhuma foto local para sincronizar' });
        observer.complete();
      });
    }

    // Criar um arquivo a partir do base64
    const byteCharacters = atob(localPhoto.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    const file = new File([blob], 'profile-photo.jpg', { type: 'image/jpeg' });

    // Tentar fazer upload para o backend
    return this.uploadPhoto(file, userId).pipe(
      tap(response => {
        console.log('Foto sincronizada com sucesso:', response);
        // Remover do localStorage após sincronização bem-sucedida
        this.removePhotoLocally(userId);
      })
    );
  }
} 