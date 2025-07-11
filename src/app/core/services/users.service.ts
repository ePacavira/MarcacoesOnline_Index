import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id?: number;
  numeroUtente?: string;
  nomeCompleto: string;
  dataNascimento: string;
  genero: string;
  telemovel: string;
  email: string;
  morada: string;
  fotoPath?: string;
  perfil: string;
  pedidos?: any[];
}

export interface PromoverUserDto {
  nomeCompleto: string;
  email: string;
  telemovel: string;
  password: string;
  dataNascimento: string;
  morada: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  // Obter todos os utilizadores
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/User`);
  }

  // Obter utilizador por ID
  getById(id: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/User/${id}`);
  }

  // Obter dados do utilizador autenticado
  getMe(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/User/me`);
  }

  // Criar utilizador
  create(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/User`, user);
  }

  // Atualizar utilizador
  update(id: number, user: User): Observable<any> {
    return this.http.put(`${environment.apiUrl}/User/${id}`, user);
  }

  // Eliminar utilizador
  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/User/${id}`);
  }

  // Promover utilizador anónimo para registado
  promover(userId: number, dados: PromoverUserDto): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/User/promover/${userId}`, dados);
  }

  // Upload de foto
  uploadFoto(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post(`${environment.apiUrl}/User/${id}/foto`, formData);
  }

  // Obter todos os utilizadores (admin)
  getAllAdmin(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/User/admin/todos`);
  }
} 