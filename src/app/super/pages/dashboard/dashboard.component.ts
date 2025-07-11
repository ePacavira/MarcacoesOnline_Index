import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"

@Component({
  selector: "app-super-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="super-dashboard-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Painel Super Administrador</h1>
          <p class="page-subtitle">Visão geral do sistema e estatísticas</p>
        </div>
        <div class="header-right">
          <button class="manage-users-btn" routerLink="/super/usuarios">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Gerir Utilizadores
          </button>
        </div>
      </div>

      <!-- Estatísticas Gerais -->
      <div class="stats-overview">
        <div class="stat-card total-users">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ getTotalUsuarios() }}</h3>
            <p class="stat-label">Total de Utilizadores</p>
            <span class="stat-change positive">+{{ getNovosUsuarios() }} este mês</span>
          </div>
        </div>

        <div class="stat-card total-pedidos">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ getTotalPedidos() }}</h3>
            <p class="stat-label">Total de Pedidos</p>
            <span class="stat-change positive">+{{ getNovosPedidos() }} este mês</span>
          </div>
        </div>

        <div class="stat-card active-sessions">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ getSessoesAtivas() }}</h3>
            <p class="stat-label">Sessões Ativas</p>
            <span class="stat-change neutral">Agora</span>
          </div>
        </div>

        <div class="stat-card system-health">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ getSaudeSistema() }}%</h3>
            <p class="stat-label">Saúde do Sistema</p>
            <span class="stat-change positive">Excelente</span>
          </div>
        </div>
      </div>

      <!-- Estatísticas por Perfil -->
      <div class="stats-sections">
        <div class="stats-section">
          <h2>Utilizadores por Perfil</h2>
          <div class="profile-stats">
            <div class="profile-stat-item">
              <div class="profile-info">
                <span class="profile-name">Utentes</span>
                <span class="profile-count">{{ getUsuariosPorPerfil('utente') }}</span>
              </div>
              <div class="profile-bar">
                <div class="profile-bar-fill" [style.width.%]="getPercentualPerfil('utente')"></div>
              </div>
            </div>
            <div class="profile-stat-item">
              <div class="profile-info">
                <span class="profile-name">Administrativos</span>
                <span class="profile-count">{{ getUsuariosPorPerfil('administrativo') }}</span>
              </div>
              <div class="profile-bar">
                <div class="profile-bar-fill" [style.width.%]="getPercentualPerfil('administrativo')"></div>
              </div>
            </div>
            <div class="profile-stat-item">
              <div class="profile-info">
                <span class="profile-name">Médicos</span>
                <span class="profile-count">{{ getUsuariosPorPerfil('medico') }}</span>
              </div>
              <div class="profile-bar">
                <div class="profile-bar-fill" [style.width.%]="getPercentualPerfil('medico')"></div>
              </div>
            </div>
            <div class="profile-stat-item">
              <div class="profile-info">
                <span class="profile-name">Administradores</span>
                <span class="profile-count">{{ getUsuariosPorPerfil('admin') }}</span>
              </div>
              <div class="profile-bar">
                <div class="profile-bar-fill" [style.width.%]="getPercentualPerfil('admin')"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="stats-section">
          <h2>Pedidos por Estado</h2>
          <div class="pedidos-stats">
            <div class="pedido-stat-item">
              <div class="pedido-info">
                <span class="pedido-status">Pedidos</span>
                <span class="pedido-count">{{ getPedidosPorEstado('pedido') }}</span>
              </div>
              <div class="pedido-bar">
                <div class="pedido-bar-fill pedido" [style.width.%]="getPercentualPedidos('pedido')"></div>
              </div>
            </div>
            <div class="pedido-stat-item">
              <div class="pedido-info">
                <span class="pedido-status">Agendados</span>
                <span class="pedido-count">{{ getPedidosPorEstado('agendado') }}</span>
              </div>
              <div class="pedido-bar">
                <div class="pedido-bar-fill agendado" [style.width.%]="getPercentualPedidos('agendado')"></div>
              </div>
            </div>
            <div class="pedido-stat-item">
              <div class="pedido-info">
                <span class="pedido-status">Realizados</span>
                <span class="pedido-count">{{ getPedidosPorEstado('realizado') }}</span>
              </div>
              <div class="pedido-bar">
                <div class="pedido-bar-fill realizado" [style.width.%]="getPercentualPedidos('realizado')"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ações Rápidas -->
      <div class="quick-actions">
        <h2>Ações Rápidas</h2>
        <div class="actions-grid">
          <button class="action-card" routerLink="/super/usuarios">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3>Gerir Utilizadores</h3>
            <p>Adicionar, editar ou remover utilizadores do sistema</p>
          </button>

          <button class="action-card" (click)="gerarRelatorio()">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </div>
            <h3>Gerar Relatório</h3>
            <p>Exportar relatório completo do sistema</p>
          </button>

          <button class="action-card" (click)="backupSistema()">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
            <h3>Backup do Sistema</h3>
            <p>Criar backup completo dos dados</p>
          </button>

          <button class="action-card" (click)="configuracoesSistema()">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </div>
            <h3>Configurações</h3>
            <p>Configurar parâmetros do sistema</p>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .super-dashboard-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: #00548d;
      margin: 0;
    }

    .page-subtitle {
      font-size: 1.1rem;
      color: #666;
      margin: 0.5rem 0 0 0;
    }

    .manage-users-btn {
      background: #dc2626;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background 0.2s;
    }

    .manage-users-btn:hover {
      background: #b91c1c;
    }

    .manage-users-btn svg {
      width: 20px;
      height: 20px;
    }

    .stats-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-card.total-users { border-left: 4px solid #3b82f6; }
    .stat-card.total-pedidos { border-left: 4px solid #10b981; }
    .stat-card.active-sessions { border-left: 4px solid #f59e0b; }
    .stat-card.system-health { border-left: 4px solid #8b5cf6; }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-card.total-users .stat-icon { background: #3b82f6; }
    .stat-card.total-pedidos .stat-icon { background: #10b981; }
    .stat-card.active-sessions .stat-icon { background: #f59e0b; }
    .stat-card.system-health .stat-icon { background: #8b5cf6; }

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

    .stats-sections {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .stats-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .stats-section h2 {
      font-size: 1.3rem;
      font-weight: 600;
      color: #00548d;
      margin: 0 0 1.5rem 0;
    }

    .profile-stats, .pedidos-stats {
      display: grid;
      gap: 1rem;
    }

    .profile-stat-item, .pedido-stat-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .profile-info, .pedido-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .profile-name, .pedido-status {
      font-weight: 500;
      color: #333;
    }

    .profile-count, .pedido-count {
      font-weight: 600;
      color: #00548d;
    }

    .profile-bar, .pedido-bar {
      height: 8px;
      background: #f3f4f6;
      border-radius: 4px;
      overflow: hidden;
    }

    .profile-bar-fill {
      height: 100%;
      background: #00548d;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .pedido-bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .pedido-bar-fill.pedido { background: #f59e0b; }
    .pedido-bar-fill.agendado { background: #10b981; }
    .pedido-bar-fill.realizado { background: #3b82f6; }

    .quick-actions {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .quick-actions h2 {
      font-size: 1.3rem;
      font-weight: 600;
      color: #00548d;
      margin: 0 0 1.5rem 0;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .action-card {
      background: #f8f9fa;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
    }

    .action-card:hover {
      background: white;
      border-color: #00548d;
      box-shadow: 0 4px 12px rgba(0,84,141,0.15);
    }

    .action-icon {
      width: 48px;
      height: 48px;
      background: #00548d;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .action-icon svg {
      width: 24px;
      height: 24px;
      color: white;
    }

    .action-card h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 0.5rem 0;
    }

    .action-card p {
      font-size: 0.9rem;
      color: #666;
      margin: 0;
    }

    @media (max-width: 768px) {
      .super-dashboard-container {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .stats-overview {
        grid-template-columns: 1fr;
      }

      .stats-sections {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SuperDashboardComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // Carregar dados do dashboard
  }

  // Métodos para estatísticas de utilizadores
  getTotalUsuarios(): number {
    return 156; // Mock data
  }

  getNovosUsuarios(): number {
    return 12; // Mock data
  }

  getUsuariosPorPerfil(perfil: string): number {
    const perfis: { [key: string]: number } = {
      'utente': 120,
      'administrativo': 8,
      'medico': 15,
      'admin': 3
    };
    return perfis[perfil] || 0;
  }

  getPercentualPerfil(perfil: string): number {
    const total = this.getTotalUsuarios();
    const count = this.getUsuariosPorPerfil(perfil);
    return total > 0 ? (count / total) * 100 : 0;
  }

  // Métodos para estatísticas de pedidos
  getTotalPedidos(): number {
    return 89; // Mock data
  }

  getNovosPedidos(): number {
    return 23; // Mock data
  }

  getPedidosPorEstado(estado: string): number {
    const estados: { [key: string]: number } = {
      'pedido': 15,
      'agendado': 8,
      'realizado': 66
    };
    return estados[estado] || 0;
  }

  getPercentualPedidos(estado: string): number {
    const total = this.getTotalPedidos();
    const count = this.getPedidosPorEstado(estado);
    return total > 0 ? (count / total) * 100 : 0;
  }

  // Outras estatísticas
  getSessoesAtivas(): number {
    return 24; // Mock data
  }

  getSaudeSistema(): number {
    return 98; // Mock data
  }

  // Métodos para ações
  gerarRelatorio() {
    console.log('Gerar relatório do sistema');
    alert('Relatório gerado com sucesso!');
  }

  backupSistema() {
    console.log('Criar backup do sistema');
    alert('Backup iniciado com sucesso!');
  }

  configuracoesSistema() {
    console.log('Abrir configurações do sistema');
    alert('Funcionalidade de configurações em desenvolvimento.');
  }
} 