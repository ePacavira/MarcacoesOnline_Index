import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <button type="button" (click)="voltar()" class="login-back-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1>Iniciar Sessão</h1>
          <p>Entre com as suas credenciais para aceder ao sistema</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              [(ngModel)]="credentials.email"
              placeholder="Digite o seu email"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Palavra-passe</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              [(ngModel)]="credentials.password"
              placeholder="Digite a sua palavra-passe"
              required
            />
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button type="submit" class="login-btn" [disabled]="isLoading">
            <span *ngIf="!isLoading">Entrar</span>
            <span *ngIf="isLoading">A entrar...</span>
          </button>
        </form>

        <div class="login-footer">
          <p>Não tem conta? <a routerLink="/marcacao-anonima">Faça uma marcação anónima</a></p>
        </div>
      </div>
    </div>
  `,
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  voltar(): void {
    this.router.navigate(['/']);
  }

  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Debug: verificar dados do utilizador
        console.log('Resposta do login:', response);
        console.log('Perfil do utilizador (número):', response.user.perfil);
        console.log('Tipo do perfil:', typeof response.user.perfil);
        
        // Redirecionar baseado no perfil (usando números)
        const user = response.user;
        let redirectPath = '/';
        
        switch (user.perfil) {
          case UserRole.ADMIN:
            redirectPath = '/super/dashboard';
            break;
          case UserRole.ADMINISTRATIVO:
            redirectPath = '/admintr/dashboard';
            break;
          case UserRole.REGISTADO:
            redirectPath = '/utente/dashboard';
            break;
          case UserRole.ANONIMO:
            redirectPath = '/';
            break;
          default:
            console.warn('Perfil não reconhecido:', user.perfil);
            redirectPath = '/';
        }
        
        console.log('Redirecionando para:', redirectPath);
        this.router.navigate([redirectPath]);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erro no login:', error);
        
        if (error.status === 401) {
          this.errorMessage = 'Email ou palavra-passe incorretos.';
        } else if (error.status === 0) {
          this.errorMessage = 'Erro de conexão. Verifique se a API está a funcionar.';
        } else {
          this.errorMessage = 'Erro ao fazer login. Tente novamente.';
        }
      }
    });
  }
}
