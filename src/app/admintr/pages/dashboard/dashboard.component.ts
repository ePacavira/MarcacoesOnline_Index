import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { PedidosService, PedidoMarcacao } from "../../../core/services/pedidos.service"

@Component({
  selector: "app-admintr-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Painel Administrativo</h1>
          <p class="page-subtitle">Gestão centralizada de todos os pedidos e marcações</p>
        </div>
        <div class="header-right">
          <button class="view-all-btn" routerLink="/admintr/pedidos">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"/>
              <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"/>
            </svg>
            Ver Todos os Pedidos
          </button>
        </div>
      </div>

      <!-- Contadores por Estado -->
      <div class="stats-grid">
        <div class="stat-card pedido">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ getPedidosCount() }}</h3>
            <p class="stat-label">Pedidos Pendentes</p>
            <span class="stat-change neutral">Aguardando agendamento</span>
          </div>
        </div>

        <div class="stat-card agendado">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ getAgendadosCount() }}</h3>
            <p class="stat-label">Pedidos Agendados</p>
            <span class="stat-change positive">Consultas confirmadas</span>
          </div>
        </div>

        <div class="stat-card realizado">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ getRealizadosCount() }}</h3>
            <p class="stat-label">Consultas Realizadas</p>
            <span class="stat-change positive">Histórico completo</span>
          </div>
        </div>

        <div class="stat-card total">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ getTotalCount() }}</h3>
            <p class="stat-label">Total de Pedidos</p>
            <span class="stat-change neutral">Todos os tipos</span>
          </div>
        </div>
      </div>

      <!-- Pedidos Recentes -->
      <div class="recent-section">
        <div class="section-header">
          <h2>Pedidos Recentes</h2>
          <button class="view-all-btn" routerLink="/admintr/pedidos">Ver Todos</button>
        </div>
        <div class="pedidos-list">
          <div *ngFor="let pedido of pedidosRecentes" class="pedido-item">
            <div class="pedido-header">
              <div class="pedido-info">
                <h4>{{ getTipoConsulta(pedido) }}</h4>
                <p>{{ getNomeUtente(pedido) }} - {{ pedido.dataInicioPreferida | date:'dd/MM/yyyy HH:mm' }}</p>
                <span class="status-badge" [class]="'status-' + getStatusClass(pedido.estado)">
                  {{ getStatusLabel(pedido.estado) }}
                </span>
              </div>
              <div class="pedido-actions">
                <button class="action-btn primary" [routerLink]="['/admintr/pedido', pedido.id]">
                  Ver Detalhes
                </button>
                <button 
                  *ngIf="pedido.estado === 0" 
                  class="action-btn success" 
                  (click)="confirmarPedido(pedido)"
                >
                  Confirmar
                </button>
                <button 
                  *ngIf="pedido.estado === 1" 
                  class="action-btn completed" 
                  (click)="realizarPedido(pedido)"
                >
                  Realizar
                </button>
              </div>
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

    .view-all-btn {
      background: #00548d;
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

    .view-all-btn:hover {
      background: #0077cc;
    }

    .view-all-btn svg {
      width: 20px;
      height: 20px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
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

    .stat-card.pedido { border-left: 4px solid #f59e0b; }
    .stat-card.agendado { border-left: 4px solid #10b981; }
    .stat-card.realizado { border-left: 4px solid #3b82f6; }
    .stat-card.total { border-left: 4px solid #8b5cf6; }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-card.pedido .stat-icon { background: #f59e0b; }
    .stat-card.agendado .stat-icon { background: #10b981; }
    .stat-card.realizado .stat-icon { background: #3b82f6; }
    .stat-card.total .stat-icon { background: #8b5cf6; }

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

    .recent-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
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

    .pedidos-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .pedido-item {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1rem;
      transition: all 0.2s;
    }

    .pedido-item:hover {
      border-color: #00548d;
      box-shadow: 0 2px 8px rgba(0,84,141,0.1);
    }

    .pedido-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .pedido-info h4 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .pedido-info p {
      margin: 0 0 0.5rem 0;
      color: #666;
      font-size: 0.9rem;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .status-pedido {
      background: #fef3c7;
      color: #92400e;
    }

    .status-agendado {
      background: #d1fae5;
      color: #065f46;
    }

    .status-realizado {
      background: #dbeafe;
      color: #1e40af;
    }

    .pedido-actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    .action-btn.primary {
      background: #00548d;
      color: white;
    }

    .action-btn.primary:hover {
      background: #0077cc;
    }

    .action-btn.success {
      background: #10b981;
      color: white;
    }

    .action-btn.success:hover {
      background: #059669;
    }

    .action-btn.completed {
      background: #3b82f6;
      color: white;
    }

    .action-btn.completed:hover {
      background: #2563eb;
    }

    .quick-stats {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .stat-item {
      text-align: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .stat-item .stat-number {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      color: #00548d;
    }

    .stat-item .stat-label {
      font-size: 0.8rem;
      color: #666;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .pedido-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .pedido-actions {
        justify-content: center;
      }
    }
  `]
})
export class AdmintrDashboardComponent implements OnInit {
  pedidosRecentes: PedidoMarcacao[] = [];
  estatisticas: {
    totalPedidos: number;
    pedidosPendentes: number;
    pedidosAgendados: number;
    pedidosRealizados: number;
  } = {
    totalPedidos: 0,
    pedidosPendentes: 0,
    pedidosAgendados: 0,
    pedidosRealizados: 0
  };

  constructor(private pedidosService: PedidosService) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    // Carregar pedidos recentes e calcular estatísticas
    this.carregarPedidosRecentes();
  }

  carregarPedidosRecentes() {
    // Carregar todas as pedidos
    this.pedidosService.getAll().subscribe({
      next: (todasPedidos) => {
        // Mostrar apenas as 6 primeiras pedidos
        this.pedidosRecentes = todasPedidos.slice(0, 6);
        // Calcular estatísticas baseadas em todas as pedidos
        this.calcularEstatisticasLocais(todasPedidos);
      },
      error: (error) => {
        console.error('Erro ao carregar pedidos:', error);
      }
    });
  }

  calcularEstatisticasLocais(todasPedidos: PedidoMarcacao[]) {
    this.estatisticas = {
      totalPedidos: todasPedidos.length,
      pedidosPendentes: todasPedidos.filter(p => p.estado === 0).length,
      pedidosAgendados: todasPedidos.filter(p => p.estado === 1).length,
      pedidosRealizados: todasPedidos.filter(p => p.estado === 2).length,
    };
  }

  getStatusLabel(estado: number): string {
    const labels: { [key: number]: string } = {
      0: 'Pendente',
      1: 'Agendado',
      2: 'Realizado',
      3: 'Cancelado'
    };
    return labels[estado] || 'Desconhecido';
  }

  getStatusClass(estado: number): string {
    const classes: { [key: number]: string } = {
      0: 'pedido',
      1: 'agendado', 
      2: 'realizado',
      3: 'cancelado'
    };
    return classes[estado] || 'unknown';
  }

  getTipoConsulta(pedido: PedidoMarcacao): string {
    if (pedido.actosClinicos && pedido.actosClinicos.length > 0) {
      return pedido.actosClinicos[0].tipo || 'Consulta';
    }
    return 'Consulta';
  }

  getNomeUtente(pedido: PedidoMarcacao): string {
    if (pedido.user) {
      return pedido.user.nomeCompleto || 'Utente';
    }
    return 'Utente Anónimo';
  }

  getPedidosCount(): number {
    return this.estatisticas.pedidosPendentes;
  }

  getAgendadosCount(): number {
    return this.estatisticas.pedidosAgendados;
  }

  getRealizadosCount(): number {
    return this.estatisticas.pedidosRealizados;
  }

  getTotalCount(): number {
    return this.estatisticas.totalPedidos;
  }

  confirmarPedido(pedido: PedidoMarcacao) {
    if (pedido.id) {
      this.pedidosService.agendar(pedido.id).subscribe({
        next: () => {
          console.log('Pedido agendado com sucesso');
          // Recarregar dados
          this.carregarDados();
        },
        error: (error) => {
          console.error('Erro ao agendar pedido:', error);
        }
      });
    }
  }

  realizarPedido(pedido: PedidoMarcacao) {
    if (pedido.id) {
      this.pedidosService.realizar(pedido.id).subscribe({
        next: () => {
          console.log('Pedido marcado como realizado');
          // Recarregar dados
          this.carregarDados();
        },
        error: (error) => {
          console.error('Erro ao marcar pedido como realizado:', error);
        }
      });
    }
  }
} 