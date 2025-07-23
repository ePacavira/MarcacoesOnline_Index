import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserRole, LoginRequest, LoginResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem('current_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      
      // Se não há foto no servidor, tenta obter do localStorage
      if (!user.fotoPath || user.fotoPath.trim() === '') {
        const localPhoto = this.getPhotoFromLocalStorage(user.id);
        if (localPhoto) {
          user.fotoPath = localPhoto;
          console.log('Foto carregada do localStorage na inicialização');
          // Atualizar o localStorage com a foto
          localStorage.setItem('current_user', JSON.stringify(user));
        }
      }
      
      this.currentUserSubject.next(user);
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('Fazendo login com:', credentials.email);
    
    return this.http.post<LoginResponse>(`${environment.apiUrl}/Auth/login`, credentials)
      .pipe(
        tap(response => {
          console.log('Resposta completa da API:', response);
          console.log('Dados do utilizador:', response.user);
          console.log('Perfil (número):', response.user.perfil);
          console.log('Tipo do perfil:', typeof response.user.perfil);
          
          // Se não há foto no servidor, tenta obter do localStorage
          if (!response.user.fotoPath || response.user.fotoPath.trim() === '') {
            const localPhoto = this.getPhotoFromLocalStorage(response.user.id);
            if (localPhoto) {
              response.user.fotoPath = localPhoto;
              console.log('Foto carregada do localStorage após login');
            }
          }
          
          // Guardar token e dados do utilizador
          localStorage.setItem('jwt_token', response.token);
          localStorage.setItem('current_user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        })
      );
  }

  // Método auxiliar para obter foto do localStorage
  private getPhotoFromLocalStorage(userId: number): string | null {
    const key = `user_photo_${userId}`;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Erro ao obter foto do localStorage:', error);
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  // Verificar perfis usando números
  isUtente(): boolean {
    const user = this.getCurrentUser();
    return user?.perfil === UserRole.REGISTADO;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.perfil === UserRole.ADMIN;
  }

  isAdminFull(): boolean {
    const user = this.getCurrentUser();
    return user?.perfil === UserRole.ADMIN;
  }

  isAdministrativo(): boolean {
    const user = this.getCurrentUser();
    return user?.perfil === UserRole.ADMINISTRATIVO;
  }

  isSuperAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.perfil === UserRole.ADMIN;
  }

  isAnonimo(): boolean {
    const user = this.getCurrentUser();
    return user?.perfil === UserRole.ANONIMO;
  }

  // Atualizar dados do utilizador (após edição)
  updateCurrentUser(user: User): void {
    localStorage.setItem('current_user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // Verificar se token está expirado (opcional)
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
