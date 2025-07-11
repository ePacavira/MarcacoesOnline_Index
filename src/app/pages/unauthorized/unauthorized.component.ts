import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="error-container">
      <div class="error-content">
        <div class="error-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        
        <h1 class="error-title">Acesso Negado</h1>
        <p class="error-message">
          Não tem permissão para aceder a esta página. 
          Contacte o administrador se acredita que isto é um erro.
        </p>
        
        <div class="error-code">403</div>
        
        <div class="error-actions">
          <button class="btn-primary" routerLink="/">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            Voltar ao Início
          </button>
          
          <button class="btn-secondary" routerLink="/contacto">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Contactar Suporte
          </button>
        </div>
        
        <div class="error-help">
          <h3>Precisa de ajuda?</h3>
          <ul>
            <li>Verifique se está autenticado no sistema</li>
            <li>Confirme se tem as permissões necessárias</li>
            <li>Contacte o administrador do sistema</li>
            <li>Consulte a documentação de ajuda</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .error-content {
      background: white;
      border-radius: 16px;
      padding: 3rem;
      text-align: center;
      max-width: 600px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }

    .error-icon {
      width: 120px;
      height: 120px;
      margin: 0 auto 2rem;
      background: #fee2e2;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #dc2626;
    }

    .error-icon svg {
      width: 60px;
      height: 60px;
    }

    .error-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 1rem 0;
    }

    .error-message {
      font-size: 1.1rem;
      color: #6b7280;
      margin: 0 0 2rem 0;
      line-height: 1.6;
    }

    .error-code {
      font-size: 6rem;
      font-weight: 900;
      color: #e5e7eb;
      margin: 2rem 0;
      line-height: 1;
    }

    .error-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin: 2rem 0;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
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
      border: 1px solid #00548d;
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

    .error-help {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
      text-align: left;
    }

    .error-help h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 1rem 0;
    }

    .error-help ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .error-help li {
      padding: 0.5rem 0;
      color: #6b7280;
      position: relative;
      padding-left: 1.5rem;
    }

    .error-help li:before {
      content: "•";
      color: #00548d;
      font-weight: bold;
      position: absolute;
      left: 0;
    }

    @media (max-width: 768px) {
      .error-container {
        padding: 1rem;
      }

      .error-content {
        padding: 2rem;
      }

      .error-title {
        font-size: 2rem;
      }

      .error-code {
        font-size: 4rem;
      }

      .error-actions {
        flex-direction: column;
      }

      .btn-primary, .btn-secondary {
        justify-content: center;
      }
    }
  `]
})
export class UnauthorizedComponent {} 