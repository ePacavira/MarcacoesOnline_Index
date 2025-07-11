import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"

@Component({
  selector: "app-pedidos",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="pedidos-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Gestão de Pedidos</h1>
          <p class="page-subtitle">Gerencie todos os pedidos de marcação (anónimos e registados)</p>
        </div>
        <div class="header-right">
          <button class="export-btn" (click)="exportarRelatorio()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exportar Relatório
          </button>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters-section">
        <div class="filters-left">
          <div class="filter-group">
            <label for="estadoFilter">Estado:</label>
            <select id="estadoFilter" [(ngModel)]="filtroEstado" (change)="aplicarFiltros()">
              <option value="">Todos</option>
              <option value="pedido">Pedido</option>
              <option value="agendado">Agendado</option>
              <option value="realizado">Realizado</option>
            </select>
          </div>
          <div class="filter-group">
            <label for="tipoFilter">Tipo:</label>
            <select id="tipoFilter" [(ngModel)]="filtroTipo" (change)="aplicarFiltros()">
              <option value="">Todos</option>
              <option value="anonimo">Anónimo</option>
              <option value="registado">Registado</option>
            </select>
          </div>
          <div class="filter-group">
            <label for="dateFilter">Período:</label>
            <select id="dateFilter" [(ngModel)]="filtroPeriodo" (change)="aplicarFiltros()">
              <option value="">Todos</option>
              <option value="hoje">Hoje</option>
              <option value="semana">Esta Semana</option>
              <option value="mes">Este Mês</option>
            </select>
          </div>
        </div>
        <div class="filters-right">
          <div class="search-box">
            <input 
              type="text" 
              placeholder="Pesquisar pedidos..." 
              [(ngModel)]="termoPesquisa"
              (input)="aplicarFiltros()"
            />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Estatísticas -->
      <div class="stats-overview">
        <div class="stat-item">
          <span class="stat-number">{{ getTotalPedidos() }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-item pedido">
          <span class="stat-number">{{ getPedidosPendentes() }}</span>
          <span class="stat-label">Pendentes</span>
        </div>
        <div class="stat-item agendado">
          <span class="stat-number">{{ getPedidosAgendados() }}</span>
          <span class="stat-label">Agendados</span>
        </div>
        <div class="stat-item realizado">
          <span class="stat-number">{{ getPedidosRealizados() }}</span>
          <span class="stat-label">Realizados</span>
        </div>
      </div>

      <!-- Lista de Pedidos -->
      <div class="pedidos-list">
        <div *ngFor="let pedido of pedidosFiltrados" class="pedido-item">
          <div class="pedido-header">
            <div class="pedido-info">
              <div class="pedido-main">
                <h3>{{ pedido.tipoConsulta }}</h3>
                <div class="pedido-details">
                  <span class="detail-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    {{ pedido.nomeUtente }}
                  </span>
                  <span class="detail-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                    {{ pedido.dataInicioPreferida | date:'dd/MM/yyyy HH:mm' }}
                  </span>
                  <span class="detail-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {{ pedido.local }}
                  </span>
                </div>
              </div>
              <div class="pedido-meta">
                <span class="tipo-badge" [class]="'tipo-' + pedido.tipo.toLowerCase()">
                  {{ pedido.tipo }}
                </span>
                <span class="status-badge" [class]="'status-' + pedido.estado.toLowerCase()">
                  {{ getStatusLabel(pedido.estado) }}
                </span>
              </div>
            </div>
            <div class="pedido-actions">
              <button class="action-btn primary" [routerLink]="['/admintr/pedido', pedido.id]">
                Ver Detalhes
              </button>
              
              <!-- Ações baseadas no estado -->
              <button 
                *ngIf="pedido.estado === 'Pedido'" 
                class="action-btn success" 
                (click)="agendarPedido(pedido)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                Agendar
              </button>
              
              <button 
                *ngIf="pedido.estado === 'Agendado'" 
                class="action-btn completed" 
                (click)="realizarPedido(pedido)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
                Realizar
              </button>
              
              <button 
                *ngIf="pedido.tipo === 'Anónimo' && pedido.estado === 'Agendado'" 
                class="action-btn promote" 
                (click)="promoverUtente(pedido)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
                Promover
              </button>
            </div>
          </div>
          
          <div class="pedido-body" *ngIf="pedido.observacoes">
            <div class="pedido-notes">
              <strong>Observações:</strong> {{ pedido.observacoes }}
            </div>
          </div>
        </div>

        <!-- Estado vazio -->
        <div *ngIf="pedidosFiltrados.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          <h3>Nenhum pedido encontrado</h3>
          <p>Não foram encontrados pedidos com os filtros aplicados.</p>
        </div>
      </div>

      <!-- Paginação -->
      <div class="pagination" *ngIf="pedidosFiltrados.length > 0">
        <button 
          class="pagination-btn" 
          [disabled]="paginaAtual === 1"
          (click)="mudarPagina(paginaAtual - 1)"
        >
          Anterior
        </button>
        <span class="pagination-info">
          Página {{ paginaAtual }} de {{ totalPaginas }}
        </span>
        <button 
          class="pagination-btn" 
          [disabled]="paginaAtual === totalPaginas"
          (click)="mudarPagina(paginaAtual + 1)"
        >
          Próxima
        </button>
      </div>
    </div>
  `,
  styles: [`
    .pedidos-container {
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

    .export-btn {
      background: #10b981;
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

    .export-btn:hover {
      background: #059669;
    }

    .export-btn svg {
      width: 20px;
      height: 20px;
    }

    .filters-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      gap: 1rem;
    }

    .filters-left {
      display: flex;
      gap: 1rem;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      font-size: 0.9rem;
      font-weight: 500;
      color: #666;
    }

    .filter-group select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-box input {
      padding: 0.5rem 1rem 0.5rem 2.5rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 0.9rem;
      width: 250px;
    }

    .search-box svg {
      position: absolute;
      left: 0.75rem;
      width: 16px;
      height: 16px;
      color: #666;
    }

    .stats-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-item {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .stat-item.pedido { border-left: 4px solid #f59e0b; }
    .stat-item.agendado { border-left: 4px solid #10b981; }
    .stat-item.realizado { border-left: 4px solid #3b82f6; }

    .stat-number {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      color: #00548d;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #666;
    }

    .pedidos-list {
      display: grid;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .pedido-item {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.2s;
    }

    .pedido-item:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .pedido-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }

    .pedido-info {
      flex: 1;
    }

    .pedido-main h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 0.5rem 0;
    }

    .pedido-details {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: #666;
    }

    .detail-item svg {
      width: 16px;
      height: 16px;
    }

    .pedido-meta {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .tipo-badge, .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .tipo-anonimo {
      background: #fef3c7;
      color: #92400e;
    }

    .tipo-registado {
      background: #dbeafe;
      color: #1e40af;
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
      flex-wrap: wrap;
    }

    .action-btn {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
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

    .action-btn.promote {
      background: #8b5cf6;
      color: white;
    }

    .action-btn.promote:hover {
      background: #7c3aed;
    }

    .action-btn svg {
      width: 16px;
      height: 16px;
    }

    .pedido-body {
      border-top: 1px solid #e5e7eb;
      padding-top: 1rem;
      margin-top: 1rem;
    }

    .pedido-notes {
      padding: 0.75rem;
      background: #f8f9fa;
      border-radius: 6px;
      font-size: 0.9rem;
      color: #666;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .empty-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1rem;
      color: #ddd;
    }

    .empty-state h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 2rem;
    }

    .pagination-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .pagination-btn:hover:not(:disabled) {
      background: #f8f9fa;
    }

    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pagination-info {
      font-size: 0.9rem;
      color: #666;
    }

    @media (max-width: 768px) {
      .pedidos-container {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .filters-section {
        flex-direction: column;
        align-items: stretch;
      }

      .filters-left {
        justify-content: center;
      }

      .search-box input {
        width: 100%;
      }

      .pedido-header {
        flex-direction: column;
        gap: 1rem;
      }

      .pedido-actions {
        justify-content: center;
      }
    }
  `]
})
export class PedidosComponent implements OnInit {
  filtroEstado = '';
  filtroTipo = '';
  filtroPeriodo = '';
  termoPesquisa = '';
  paginaAtual = 1;
  itensPorPagina = 10;
  
  todosPedidos: any[] = [];
  pedidosFiltrados: any[] = [];

  constructor() {}

  ngOnInit() {
    this.carregarPedidos();
  }

  carregarPedidos() {
    // Mock data - em produção viria do serviço
    this.todosPedidos = [
      {
        id: 1,
        tipoConsulta: 'Consulta Geral',
        nomeUtente: 'João Silva',
        dataInicioPreferida: new Date('2024-01-15 10:00'),
        local: 'Clínica Medi - Lisboa',
        estado: 'Pedido',
        tipo: 'Registado',
        observacoes: 'Trazer exames recentes'
      },
      {
        id: 2,
        tipoConsulta: 'Exame Clínico',
        nomeUtente: 'Maria Santos',
        dataInicioPreferida: new Date('2024-01-16 14:30'),
        local: 'Clínica Medi - Porto',
        estado: 'Agendado',
        tipo: 'Anónimo',
        observacoes: ''
      },
      {
        id: 3,
        tipoConsulta: 'Consulta de Especialidade',
        nomeUtente: 'Carlos Oliveira',
        dataInicioPreferida: new Date('2024-01-14 09:00'),
        local: 'Clínica Medi - Lisboa',
        estado: 'Realizado',
        tipo: 'Registado',
        observacoes: 'Consulta realizada com sucesso'
      },
      {
        id: 4,
        tipoConsulta: 'Exame de Sangue',
        nomeUtente: 'Ana Costa',
        dataInicioPreferida: new Date('2024-01-17 08:00'),
        local: 'Clínica Medi - Lisboa',
        estado: 'Pedido',
        tipo: 'Anónimo',
        observacoes: 'Primeira consulta'
      }
    ];
    
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let filtradas = [...this.todosPedidos];

    // Filtro por estado
    if (this.filtroEstado) {
      filtradas = filtradas.filter(p => 
        p.estado.toLowerCase() === this.filtroEstado.toLowerCase()
      );
    }

    // Filtro por tipo
    if (this.filtroTipo) {
      filtradas = filtradas.filter(p => 
        p.tipo.toLowerCase() === this.filtroTipo.toLowerCase()
      );
    }

    // Filtro por período
    if (this.filtroPeriodo) {
      const hoje = new Date();
      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(hoje.getDate() - hoje.getDay());
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

      filtradas = filtradas.filter(p => {
        const dataPedido = new Date(p.dataInicioPreferida);
        switch (this.filtroPeriodo) {
          case 'hoje':
            return dataPedido.toDateString() === hoje.toDateString();
          case 'semana':
            return dataPedido >= inicioSemana;
          case 'mes':
            return dataPedido >= inicioMes;
          default:
            return true;
        }
      });
    }

    // Filtro por pesquisa
    if (this.termoPesquisa) {
      const termo = this.termoPesquisa.toLowerCase();
      filtradas = filtradas.filter(p =>
        p.tipoConsulta.toLowerCase().includes(termo) ||
        p.nomeUtente.toLowerCase().includes(termo) ||
        p.local.toLowerCase().includes(termo)
      );
    }

    this.pedidosFiltrados = filtradas;
    this.paginaAtual = 1;
  }

  getStatusLabel(estado: string): string {
    const labels: { [key: string]: string } = {
      'Pedido': 'Pedido',
      'Agendado': 'Agendado',
      'Realizado': 'Realizado'
    };
    return labels[estado] || estado;
  }

  getTotalPedidos(): number {
    return this.todosPedidos.length;
  }

  getPedidosPendentes(): number {
    return this.todosPedidos.filter(p => p.estado === 'Pedido').length;
  }

  getPedidosAgendados(): number {
    return this.todosPedidos.filter(p => p.estado === 'Agendado').length;
  }

  getPedidosRealizados(): number {
    return this.todosPedidos.filter(p => p.estado === 'Realizado').length;
  }

  get totalPaginas(): number {
    return Math.ceil(this.pedidosFiltrados.length / this.itensPorPagina);
  }

  mudarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
    }
  }

  agendarPedido(pedido: any) {
    if (confirm(`Confirmar agendamento para ${pedido.nomeUtente}?`)) {
      console.log('Agendar pedido:', pedido);
      // Implementar lógica de agendamento
      alert('Pedido agendado com sucesso! Email de confirmação enviado.');
    }
  }

  realizarPedido(pedido: any) {
    if (confirm(`Confirmar realização da consulta para ${pedido.nomeUtente}?`)) {
      console.log('Realizar pedido:', pedido);
      // Implementar lógica de realização
      alert('Consulta realizada com sucesso!');
    }
  }

  promoverUtente(pedido: any) {
    if (confirm(`Promover ${pedido.nomeUtente} para utente registado?`)) {
      console.log('Promover utente:', pedido);
      // Implementar lógica de promoção
      alert('Utente promovido com sucesso! Email com credenciais enviado.');
    }
  }

  exportarRelatorio() {
    console.log('Exportar relatório');
    // Implementar exportação de relatório
    alert('Relatório exportado com sucesso!');
  }
} 