import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-conta-criada',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="conta-criada-container">
      <div class="success-card">
        <!-- Ícone de sucesso -->
        <div class="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22,4 12,14.01 9,11.01"/>
          </svg>
        </div>

        <!-- Título e mensagem -->
        <div class="success-content">
          <h1 class="success-title">Conta Criada com Sucesso!</h1>
          <p class="success-message">
            Parabéns! A sua conta foi criada com sucesso. Agora pode aceder a todas as funcionalidades da Clínica Medi.
          </p>
        </div>

        <!-- Informações da conta -->
        <div class="account-info">
          <h2>Informações da Sua Conta</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Email:</span>
              <span class="info-value">{{ dadosConta.email }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Password:</span>
              <span class="info-value password-field">
                <span class="password-dots">{{ getPasswordDots() }}</span>
                <button class="show-password-btn" (click)="togglePassword()">
                  <svg *ngIf="!mostrarPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg *ngIf="mostrarPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">Número de Utente:</span>
              <span class="info-value">{{ dadosConta.numeroUtente }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Tipo de Conta:</span>
              <span class="info-value">{{ dadosConta.tipoConta }}</span>
            </div>
          </div>
        </div>

        <!-- Avisos importantes -->
        <div class="important-notices">
          <h3>Informações Importantes</h3>
          <ul class="notices-list">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Guarde estas informações num local seguro
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Pode alterar a password após o primeiro login
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              A sua conta está ativa e pronta para uso
            </li>
          </ul>
        </div>

        <!-- Botões de ação -->
        <div class="action-buttons">
          <button class="btn-primary" (click)="irParaLogin()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10,17 15,12 10,7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Ir para Login
          </button>
          <button class="btn-secondary" (click)="irParaHome()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            Voltar ao Início
          </button>
        </div>

        <!-- Link para ajuda -->
        <div class="help-section">
          <p>Precisa de ajuda? <a routerLink="/contacto">Contacte-nos</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .conta-criada-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #00548d 0%, #0077cc 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .success-card {
      background: white;
      border-radius: 20px;
      padding: 3rem;
      max-width: 600px;
      width: 100%;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      text-align: center;
    }

    .success-icon {
      width: 80px;
      height: 80px;
      background: #10b981;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 2rem;
      color: white;
    }

    .success-icon svg {
      width: 40px;
      height: 40px;
    }

    .success-content {
      margin-bottom: 2rem;
    }

    .success-title {
      font-size: 2rem;
      font-weight: 700;
      color: #00548d;
      margin: 0 0 1rem 0;
    }

    .success-message {
      font-size: 1.1rem;
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    .account-info {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      text-align: left;
    }

    .account-info h2 {
      font-size: 1.3rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 1.5rem 0;
      text-align: center;
    }

    .info-grid {
      display: grid;
      gap: 1rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: white;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }

    .info-label {
      font-weight: 600;
      color: #666;
    }

    .info-value {
      font-weight: 500;
      color: #333;
    }

    .password-field {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .password-dots {
      font-family: monospace;
      letter-spacing: 2px;
    }

    .show-password-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .show-password-btn:hover {
      background: #f3f4f6;
    }

    .show-password-btn svg {
      width: 16px;
      height: 16px;
      color: #666;
    }

    .important-notices {
      margin-bottom: 2rem;
    }

    .important-notices h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 1rem 0;
    }

    .notices-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 0.75rem;
    }

    .notices-list li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: #fef3c7;
      border-radius: 8px;
      color: #92400e;
      font-size: 0.9rem;
    }

    .notices-list li svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      justify-content: center;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
      text-decoration: none;
    }

    .btn-primary {
      background: #00548d;
      color: white;
    }

    .btn-primary:hover {
      background: #0077cc;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: transparent;
      color: #00548d;
      border: 2px solid #00548d;
    }

    .btn-secondary:hover {
      background: #00548d;
      color: white;
      transform: translateY(-2px);
    }

    .btn-primary svg, .btn-secondary svg {
      width: 20px;
      height: 20px;
    }

    .help-section {
      border-top: 1px solid #e5e7eb;
      padding-top: 1.5rem;
    }

    .help-section p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .help-section a {
      color: #00548d;
      text-decoration: none;
      font-weight: 500;
    }

    .help-section a:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .conta-criada-container {
        padding: 1rem;
      }

      .success-card {
        padding: 2rem;
      }

      .success-title {
        font-size: 1.5rem;
      }

      .info-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .action-buttons {
        flex-direction: column;
      }

      .btn-primary, .btn-secondary {
        justify-content: center;
      }
    }
  `]
})
export class ContaCriadaComponent implements OnInit {
  dadosConta: any = {
    email: '',
    password: '',
    numeroUtente: '',
    tipoConta: 'Utente Registado'
  };
  mostrarPassword = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Obter dados da conta dos parâmetros da URL ou localStorage
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.dadosConta.email = params['email'];
      }
      if (params['password']) {
        this.dadosConta.password = params['password'];
      }
      if (params['numeroUtente']) {
        this.dadosConta.numeroUtente = params['numeroUtente'];
      }
    });

    // Se não houver parâmetros, usar dados do localStorage (simulação)
    if (!this.dadosConta.email) {
      const dadosSalvos = localStorage.getItem('contaCriada');
      if (dadosSalvos) {
        this.dadosConta = JSON.parse(dadosSalvos);
      } else {
        // Dados de exemplo para demonstração
        this.dadosConta = {
          email: 'joao.silva@email.com',
          password: '123456',
          numeroUtente: '123456789',
          tipoConta: 'Utente Registado'
        };
      }
    }
  }

  getPasswordDots(): string {
    if (this.mostrarPassword) {
      return this.dadosConta.password;
    }
    return '•'.repeat(this.dadosConta.password.length);
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }

  irParaHome() {
    this.router.navigate(['/']);
  }
} 