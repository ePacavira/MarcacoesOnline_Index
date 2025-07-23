import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UtenteService {
  private apiUrl = '/api/utente';
  constructor(private http: HttpClient) {}

  // Buscar lista de utentes com filtros opcionais
  getUtentes(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/utentes`);
  }

  // Buscar um utente por ID
  getUtenteById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Criar novo utente
  createUtente(utente: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, utente);
  }

  // Atualizar utente
  updateUtente(id: string, utente: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, utente);
  }

  // Eliminar utente
  deleteUtente(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
