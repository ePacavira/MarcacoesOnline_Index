import { Component, type OnInit, signal } from "@angular/core"
import { CommonModule } from "@angular/common"
import { AuthService } from "../../../core/services/auth.service"
import { UserProfileService } from "../../../core/services/user-profile.service"
import { MarcacaoService } from '../../../core/services/marcacao';
import { PedidoMarcacao } from '../../../models/marcacao.interface';

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
          <p class="dashboard-subtitle">Bem-vindo, {{ currentUser?.nomeCompleto || 'Utente' }}</p>
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
            <h3 class="stat-number">{{ totalPendentes }}</h3>
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
            <h3 class="stat-number">{{ totalAgendadas }}</h3>
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
            <h3 class="stat-number">{{ totalRealizadas }}</h3>
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

      <!-- Secções lado a lado -->
      <div class="dashboard-sections-row">
        <!-- Dados Pessoais -->
        <div class="profile-section">
          <div class="section-header">
            <h2>Dados Pessoais</h2>
          </div>
          <div class="profile-grid">
            <div class="profile-photo">
              <img [src]="getFotoPerfilSrc()" alt="Foto de perfil" class="avatar" />
              <button class="change-photo-btn" routerLink="/utente/profile">Alterar Foto</button>
            </div>
            <div class="profile-info">
              <div class="info-row">
                <span class="info-label">Nome:</span>
                <span class="info-value">{{ currentUser?.nomeCompleto }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">{{ currentUser?.email }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Telefone:</span>
                <span class="info-value">{{ currentUser?.telefone || currentUser?.telemovel || 'Não informado' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Data de Nascimento:</span>
                <span class="info-value">{{ currentUser?.dataNascimento | date:'dd/MM/yyyy' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Endereço:</span>
                <span class="info-value">{{ currentUser?.endereco || currentUser?.morada || 'Não informado' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Género:</span>
                <span class="info-value">{{ currentUser?.genero || 'Não informado' }}</span>
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
            @if (proximasMarcacoes().length > 0) {
              @for (marcacao of proximasMarcacoes().slice(0, 3); track marcacao.id) {
                <div class="appointment-item">
                  <div class="appointment-date">
                    <span class="day">{{ marcacao.dataInicioPreferida | date:'dd' }}</span>
                    <span class="month">{{ marcacao.dataInicioPreferida | date:'MMM' }}</span>
                  </div>
                  <div class="appointment-details">
                    <h4>{{ marcacao.actosClinicos[0]?.tipo || 'Consulta' }}</h4>
                    <p>{{ marcacao.horarioPreferido }} - {{ marcacao.actosClinicos[0]?.profissional || 'Médico' }}</p>
                    <span class="status" [class]="getStatusClass(marcacao.estado)">{{ getStatusText(marcacao.estado) }}</span>
                  </div>
                  <div class="appointment-actions">
                    <button class="action-btn" (click)="verDetalhesPedido(marcacao.id)">Ver Detalhes</button>
                  </div>
                </div>
              }
            } @else {
              <div class="no-appointments">
                <p>Não tem consultas agendadas</p>
                <button class="schedule-btn" routerLink="/marcacoes">Agendar Consulta</button>
              </div>
            }
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
      background: #00548d;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .stat-icon svg {
      width: 24px;
      height: 24px;
    }

    .stat-content {
      flex: 1;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: #00548d;
      margin: 0;
      line-height: 1;
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

    .stat-change.positive {
      color: #059669;
    }

    .stat-change.negative {
      color: #dc2626;
    }

    .stat-change.neutral {
      color: #6b7280;
    }

    .dashboard-content {
      display: grid;
      gap: 2rem;
    }

    .profile-section,
    .upcoming-section {
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
      color: #1f2937;
      margin: 0;
    }

    .edit-btn,
    .view-all-btn {
      background: #00548d;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .edit-btn:hover,
    .view-all-btn:hover {
      background: #003a5c;
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
      border: 4px solid #f3f4f6;
      margin-bottom: 1rem;
    }

    .change-photo-btn {
      background: #f3f4f6;
      color: #374151;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .change-photo-btn:hover {
      background: #e5e7eb;
    }

    .profile-info {
      display: grid;
      gap: 1rem;
    }

    .info-row {
      display: flex;
      gap: 1rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .info-label {
      font-weight: 600;
      color: #374151;
      min-width: 140px;
    }

    .info-value {
      color: #6b7280;
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
      transition: border-color 0.2s;
    }

    .appointment-item:hover {
      border-color: #00548d;
    }

    .appointment-date {
      text-align: center;
      min-width: 60px;
    }

    .day {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      color: #00548d;
    }

    .month {
      display: block;
      font-size: 0.8rem;
      color: #6b7280;
      text-transform: uppercase;
    }

    .appointment-details {
      flex: 1;
    }

    .appointment-details h4 {
      margin: 0 0 0.25rem 0;
      color: #1f2937;
    }

    .appointment-details p {
      margin: 0 0 0.5rem 0;
      color: #6b7280;
      font-size: 0.9rem;
    }

    .status {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .status.pendente {
      background: #fef3c7;
      color: #92400e;
    }

    .status.confirmado {
      background: #d1fae5;
      color: #065f46;
    }

    .status.concluido {
      background: #dbeafe;
      color: #1e40af;
    }

    .status.cancelado {
      background: #fee2e2;
      color: #991b1b;
    }

    .action-btn {
      background: #f3f4f6;
      color: #374151;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .action-btn:hover {
      background: #e5e7eb;
    }

    .no-appointments {
      text-align: center;
      padding: 2rem;
      color: #6b7280;
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
      background: #003a5c;
    }

    .dashboard-sections-row {
      display: flex;
      gap: 2rem;
      align-items: stretch;
    }
    .profile-section, .upcoming-section {
      flex: 1 1 0;
      min-width: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    @media (max-width: 900px) {
      .dashboard-sections-row {
        flex-direction: column;
        gap: 2rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentDate = '';
  currentUser: any = null;
  proximasMarcacoes = signal<any[]>([]);
  userStats = signal({
    totalPedidos: 0,
    pedidosPendentes: 0,
    pedidosConfirmados: 0,
    pedidosConcluidos: 0,
    pedidosCancelados: 0
  });
  marcacoes: any[] = [];
  totalPendentes = 0;
  totalAgendadas = 0;
  totalRealizadas = 0;

  constructor(
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private marcacaoService: MarcacaoService
  ) {}

  ngOnInit() {
    this.currentDate = new Date().toLocaleDateString('pt-PT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    this.carregarDadosUtente();
    this.carregarEstatisticas();
    this.carregarProximasMarcacoes();
    this.carregarMarcacoesUtente();
  }

  carregarDadosUtente() {
    this.currentUser = this.authService.getCurrentUser();
    
    // Se não temos dados completos, carregar da API
    if (this.currentUser && !this.currentUser.nomeCompleto) {
      this.userProfileService.getUserProfile().subscribe({
        next: (user) => {
          this.currentUser = user;
          // Atualizar dados no AuthService
          this.authService.updateCurrentUser(user);
        },
        error: (error) => {
          console.error('Erro ao carregar dados do utilizador:', error);
        }
      });
    }
  }

  carregarEstatisticas() {
    this.userProfileService.getUserStats().subscribe({
      next: (stats) => {
        // Garante que todos os campos são números válidos
        this.userStats.set({
          totalPedidos: stats?.totalPedidos ?? 0,
          pedidosPendentes: stats?.pedidosPendentes ?? 0,
          pedidosConfirmados: stats?.pedidosConfirmados ?? 0,
          pedidosConcluidos: stats?.pedidosConcluidos ?? 0,
          pedidosCancelados: stats?.pedidosCancelados ?? 0
        });
      },
      error: (error) => {
        // Em caso de erro, zera os contadores
        this.userStats.set({
          totalPedidos: 0,
          pedidosPendentes: 0,
          pedidosConfirmados: 0,
          pedidosConcluidos: 0,
          pedidosCancelados: 0
        });
        console.error('Erro ao carregar estatísticas:', error);
      }
    });
  }

  carregarProximasMarcacoes() {
    this.userProfileService.getUserPedidos().subscribe({
      next: (pedidos) => {
        const pedidosArray = Array.isArray(pedidos) ? pedidos : [];
        // Filtrar apenas estados 0, 1 e 2, ordenar por data desc (mais recente primeiro)
        const proximos = pedidosArray
          .filter(pedido => [0, 1, 2].includes(pedido.estado))
          .sort((a, b) => new Date(b.dataInicioPreferida).getTime() - new Date(a.dataInicioPreferida).getTime())
          .slice(0, 3); // Apenas as 3 mais recentes
        this.proximasMarcacoes.set(proximos);
      },
      error: (error) => {
        this.proximasMarcacoes.set([]);
        console.error('Erro ao carregar marcações:', error);
      }
    });
  }

  carregarMarcacoesUtente() {
    this.userProfileService.getUserPedidos().subscribe({
      next: (pedidos: any[]) => {
        this.marcacoes = pedidos || [];
        this.totalPendentes = this.marcacoes.filter(m => m.estado === 0).length;
        this.totalAgendadas = this.marcacoes.filter(m => m.estado === 1).length;
        this.totalRealizadas = this.marcacoes.filter(m => m.estado === 2).length;
      },
      error: () => {
        this.marcacoes = [];
        this.totalPendentes = 0;
        this.totalAgendadas = 0;
        this.totalRealizadas = 0;
      }
    });
  }

  getStatusText(estado: number): string {
    switch (estado) {
      case 0: return 'Pendente';
      case 1: return 'Agendado';
      case 2: return 'Realizado';
      case 3: return 'Cancelado';
      default: return 'Desconhecido';
    }
  }

  getStatusClass(estado: number): string {
    switch (estado) {
      case 0: return 'pendente';
      case 1: return 'agendado';
      case 2: return 'realizado';
      case 3: return 'cancelado';
      default: return 'pendente';
    }
  }

  verDetalhesPedido(id: number) {
    // Implementar navegação para detalhes do pedido
    console.log('Ver detalhes do pedido:', id);
  }

  getFotoPerfilSrc(): string {
    const foto = this.currentUser?.fotoPath;
    if (foto) {
      let url = foto;
      if (url.startsWith('http://')) {
        url = url.replace('http://', 'https://');
      }
      return url + '?t=' + Date.now();
    }
    return '/assets/default-avatar.png';
  }
}
