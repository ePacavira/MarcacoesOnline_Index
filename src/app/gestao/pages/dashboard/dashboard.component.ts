import { Component, type OnInit, signal } from "@angular/core"
import { CommonModule } from "@angular/common"
import { AuthService } from "../../../core/services/auth.service"

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <!-- Header do Utente -->
      <div class="dashboard-header">
        <div class="header-left">
          <h1 class="dashboard-title">Painel do Utente</h1>
          <p class="dashboard-subtitle">Bem-vindo, {{ currentUser?.nome || 'Utente' }}</p>
        </div>
        <div class="header-right">
          <div class="date-info">
            <span class="current-date">{{ currentDate }}</span>
          </div>
        </div>
      </div>

      <!-- Cards de Estatísticas do Utente -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ getPendingCount() }}</h3>
            <p class="stat-label">Marcações Pendentes</p>
            <span class="stat-change neutral">Aguardando confirmação</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"/>
              <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ getConfirmedCount() }}</h3>
            <p class="stat-label">Marcações Confirmadas</p>
            <span class="stat-change positive">Próximas consultas</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ getCompletedCount() }}</h3>
            <p class="stat-label">Consultas Realizadas</p>
            <span class="stat-change positive">Histórico completo</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ currentUser?.numeroUtente || 'N/A' }}</h3>
            <p class="stat-label">Número de Utente</p>
            <span class="stat-change neutral">Identificação única</span>
          </div>
        </div>
      </div>

      <!-- Dados Pessoais -->
      <div class="dashboard-content">
        <div class="profile-section">
          <div class="section-header">
            <h2>Dados Pessoais</h2>
            <button class="edit-btn" routerLink="/utente/profile">Editar Perfil</button>
          </div>
          <div class="profile-grid">
            <div class="profile-photo">
              <img [src]="currentUser?.foto || '/assets/default-avatar.png'" alt="Foto de perfil" class="avatar" />
              <button class="change-photo-btn">Alterar Foto</button>
            </div>
            <div class="profile-info">
              <div class="info-row">
                <span class="info-label">Nome:</span>
                <span class="info-value">{{ currentUser?.nome }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">{{ currentUser?.email }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Telefone:</span>
                <span class="info-value">{{ currentUser?.telefone }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Data de Nascimento:</span>
                <span class="info-value">{{ currentUser?.dataNascimento | date:'dd/MM/yyyy' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Endereço:</span>
                <span class="info-value">{{ currentUser?.endereco }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Tipo de Usuário:</span>
                <span class="info-value">{{ currentUser?.tipoUsuario }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Próximas Consultas -->
        <div class="upcoming-section">
          <div class="section-header">
            <h2>Próximas Consultas</h2>
            <button class="view-all-btn" routerLink="/utente/minhas-marcacoes">Ver Todas</button>
          </div>
          <div class="appointments-list">
            <div *ngFor="let marcacao of proximasMarcacoes" class="appointment-item">
              <div class="appointment-date">
                <span class="day">{{ marcacao.dataInicioPreferida | date:'dd' }}</span>
                <span class="month">{{ marcacao.dataInicioPreferida | date:'MMM' }}</span>
              </div>
              <div class="appointment-details">
                <h4>{{ marcacao.tipoConsulta }}</h4>
                <p>{{ marcacao.horarioPreferido }} - {{ marcacao.medico }}</p>
                <span class="status confirmed">Confirmada</span>
              </div>
              <div class="appointment-actions">
                <button class="action-btn">Ver Detalhes</button>
              </div>
            </div>
            <div *ngIf="proximasMarcacoes.length === 0" class="no-appointments">
              <p>Não tem consultas agendadas</p>
              <button class="schedule-btn" routerLink="/marcacao-anonima">Agendar Consulta</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .dashboard-title {
      font-size: 2rem;
      font-weight: 700;
      color: #00548d;
      margin: 0;
    }

    .dashboard-subtitle {
      font-size: 1.1rem;
      color: #666;
      margin: 0.5rem 0 0 0;
    }

    .current-date {
      font-size: 1rem;
      color: #666;
      background: #f8f9fa;
      padding: 0.5rem 1rem;
      border-radius: 6px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      background: #e6f1fa;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #00548d;
    }

    .stat-content h3 {
      font-size: 1.8rem;
      font-weight: 700;
      color: #00548d;
      margin: 0;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #666;
      margin: 0.25rem 0;
    }

    .stat-change {
      font-size: 0.8rem;
      font-weight: 500;
    }

    .stat-change.positive { color: #10b981; }
    .stat-change.negative { color: #ef4444; }
    .stat-change.neutral { color: #6b7280; }

    .dashboard-content {
      display: grid;
      gap: 2rem;
    }

    .profile-section, .upcoming-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-header h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #00548d;
      margin: 0;
    }

    .edit-btn, .view-all-btn {
      background: #00548d;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .edit-btn:hover, .view-all-btn:hover {
      background: #0077cc;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 2rem;
      align-items: start;
    }

    .profile-photo {
      text-align: center;
    }

    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #e6f1fa;
      margin-bottom: 1rem;
    }

    .change-photo-btn {
      background: transparent;
      color: #00548d;
      border: 1px solid #00548d;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .change-photo-btn:hover {
      background: #00548d;
      color: white;
    }

    .profile-info {
      display: grid;
      gap: 1rem;
    }

    .info-row {
      display: flex;
      gap: 1rem;
    }

    .info-label {
      font-weight: 600;
      color: #666;
      min-width: 120px;
    }

    .info-value {
      color: #333;
    }

    .appointments-list {
      display: grid;
      gap: 1rem;
    }

    .appointment-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      transition: all 0.2s;
    }

    .appointment-item:hover {
      border-color: #00548d;
      box-shadow: 0 2px 8px rgba(0,84,141,0.1);
    }

    .appointment-date {
      text-align: center;
      min-width: 60px;
    }

    .appointment-date .day {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      color: #00548d;
    }

    .appointment-date .month {
      display: block;
      font-size: 0.8rem;
      color: #666;
      text-transform: uppercase;
    }

    .appointment-details {
      flex: 1;
    }

    .appointment-details h4 {
      margin: 0 0 0.25rem 0;
      color: #333;
    }

    .appointment-details p {
      margin: 0 0 0.5rem 0;
      color: #666;
      font-size: 0.9rem;
    }

    .status {
      font-size: 0.8rem;
      font-weight: 500;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .status.confirmed {
      background: #d1fae5;
      color: #065f46;
    }

    .action-btn {
      background: transparent;
      color: #00548d;
      border: 1px solid #00548d;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn:hover {
      background: #00548d;
      color: white;
    }

    .no-appointments {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .schedule-btn {
      background: #00548d;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
      transition: background 0.2s;
    }

    .schedule-btn:hover {
      background: #0077cc;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .profile-grid {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .appointment-item {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentDate = '';
  currentUser: any = null;
  proximasMarcacoes: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentDate = new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    this.currentUser = this.authService.getCurrentUser();
    this.carregarProximasMarcacoes();
  }

  carregarProximasMarcacoes() {
    // Mock data - em produção viria do serviço
    this.proximasMarcacoes = [
      {
        dataInicioPreferida: new Date('2024-01-15'),
        tipoConsulta: 'Consulta Geral',
        horarioPreferido: '10:00',
        medico: 'Dr. João Silva',
        estado: 'Confirmada'
      },
      {
        dataInicioPreferida: new Date('2024-01-20'),
        tipoConsulta: 'Exame Clínico',
        horarioPreferido: '14:30',
        medico: 'Dra. Maria Santos',
        estado: 'Confirmada'
      }
    ];
  }

  getPendingCount(): number {
    return 2; // Mock data
  }

  getConfirmedCount(): number {
    return 3; // Mock data
  }

  getCompletedCount(): number {
    return 15; // Mock data
  }
}
