import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { UsersService } from '../../../core/services/users.service';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: "app-super-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule, NgChartsModule],
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

        <div class="stat-card total-hoje">
          <div class="stat-icon" style="background: #3b82f6;">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
              <circle cx="12" cy="16" r="2"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ getMarcacoesHoje() }}</h3>
            <p class="stat-label">Total de marcações hoje</p>
            <span class="stat-change neutral">Hoje</span>
          </div>
        </div>
        <!-- Removido o card de Sessões Ativas -->
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
            <!-- Removido o bloco de Administradores -->
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
      <!-- Removida a secção de Ações Rápidas -->

      <!-- Gráficos -->
      <div class="charts-section" style="display: flex; gap: 2rem; margin-bottom: 2rem; flex-wrap: wrap;">
        <div style="flex:1; min-width: 320px; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 1.5rem;">
          <h3 style="color: #00548d; font-weight: 700; margin-bottom: 1rem;">Utilizadores por Perfil</h3>
          <canvas baseChart
            [data]="usuariosPerfilChartData"
            [type]="'pie'"
            [options]="usuariosPerfilChartOptions">
          </canvas>
            </div>
        <div style="flex:1; min-width: 320px; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 1.5rem;">
          <h3 style="color: #00548d; font-weight: 700; margin-bottom: 1rem;">Pedidos por Estado</h3>
          <canvas baseChart
            [data]="pedidosEstadoChartData"
            [type]="'bar'"
            [options]="pedidosEstadoChartOptions">
          </canvas>
        </div>
      </div>
    </div>
  `,
  styles: [`
    html, body, .super-dashboard-container {
      overflow-x: hidden !important;
      overflow-y: hidden !important;
    }
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
    }
  `]
})
export class SuperDashboardComponent implements OnInit {
  totalUsuarios = 0;
  totalPedidos = 0;
  usuariosPorPerfil: { [key: string]: number } = { utente: 0, administrativo: 0, administrador: 0, medico: 0 };
  pedidosPorEstado: { [key: string]: number } = { pedido: 0, agendado: 0, realizado: 0 };
  marcacoesHoje = 0;

  // Gráfico de Utilizadores por Perfil
  usuariosPerfilChartData = {
    labels: ['Utentes', 'Administrativos', 'Administradores', 'Médicos'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        label: 'Utilizadores',
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
      }
    ]
  };
  usuariosPerfilChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const }
    }
  };

  // Gráfico de Pedidos por Estado
  pedidosEstadoChartData = {
    labels: ['Pedidos', 'Agendados', 'Realizados'],
    datasets: [
      {
        data: [0, 0, 0],
        label: 'Pedidos',
        backgroundColor: ['#6366f1', '#22d3ee', '#fbbf24']
      }
    ]
  };
  pedidosEstadoChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }
    }
  };

  constructor(
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.usersService.getAllUsers().subscribe(users => {
      this.totalUsuarios = users.length;
      this.usuariosPorPerfil = { utente: 0, administrativo: 0, administrador: 0, medico: 0 };
      users.forEach(u => {
        switch (u.perfil) {
          case 0: this.usuariosPorPerfil['utente']++; break; // Anónimo
          case 1: this.usuariosPorPerfil['utente']++; break; // Registado
          case 2: this.usuariosPorPerfil['administrativo']++; break;
          case 3: this.usuariosPorPerfil['administrador']++; break;
          // case 4: this.usuariosPorPerfil['medico']++; break; // Se existir
        }
      });
    });

    // Atualizar dados dos gráficos após carregar os dados reais
    setTimeout(() => {
      this.usuariosPerfilChartData = {
        labels: ['Utentes', 'Administrativos', 'Administradores', 'Médicos'],
        datasets: [
          {
            data: [
              this.getUsuariosPorPerfil('utente'),
              this.getUsuariosPorPerfil('administrativo'),
              this.getUsuariosPorPerfil('administrador'),
              this.getUsuariosPorPerfil('medico')
            ],
            label: 'Utilizadores',
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
          }
        ]
      };
      this.pedidosEstadoChartData = {
        labels: ['Pedidos', 'Agendados', 'Realizados'],
        datasets: [
          {
            data: [
              this.getPedidosPorEstado('pedido'),
              this.getPedidosPorEstado('agendado'),
              this.getPedidosPorEstado('realizado')
            ],
            label: 'Pedidos',
            backgroundColor: ['#6366f1', '#22d3ee', '#fbbf24']
          }
        ]
      };
    }, 500);
  }

  getTotalUsuarios() { return this.totalUsuarios; }
  getNovosUsuarios(): number {
    return 12; // Mock data
  }
  getUsuariosPorPerfil(perfil: string) {
    return this.usuariosPorPerfil[perfil] || 0;
  }
  getPercentualPerfil(perfil: string): number {
    const total = this.getTotalUsuarios();
    const count = this.getUsuariosPorPerfil(perfil);
    return total > 0 ? (count / total) * 100 : 0;
  }

  getTotalPedidos() { return this.totalPedidos; }
  getNovosPedidos(): number {
    return 23; // Mock data
  }
  getPedidosPorEstado(estado: string) {
    return this.pedidosPorEstado[estado] || 0;
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

  getMarcacoesHoje(): number {
    return this.marcacoesHoje;
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