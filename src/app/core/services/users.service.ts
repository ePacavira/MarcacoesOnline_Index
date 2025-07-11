import { Injectable, inject } from '@angular/core';
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

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/User`;

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateUser(id: number, dados: any) {
    return this.http.put(`${this.apiUrl}/${id}`, dados);
  }

  promoverUser(id: number, dados: any) {
    return this.http.patch(`${this.apiUrl}/promover/${id}`, dados);
  }

  eliminarUser(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 