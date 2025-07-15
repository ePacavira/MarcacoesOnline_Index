import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { PedidosService, PedidoMarcacao } from "../../../core/services/pedidos.service"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

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
                <h3>{{ pedido.actosClinicos && pedido.actosClinicos.length > 0 ? pedido.actosClinicos[0].tipo : 'Consulta' }}</h3>
                <div class="pedido-details">
                  <span class="detail-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    {{ pedido.user?.nomeCompleto || 'Utente Anónimo' }}
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
                    {{ pedido.actosClinicos && pedido.actosClinicos.length > 0 ? pedido.actosClinicos[0].subsistemaSaude : '' }}
                  </span>
                </div>
              </div>
              <div class="pedido-meta">
                <span class="status-badge" [class]="'status-' + getStatusClass(pedido.estado)">
                  {{ getStatusLabel(pedido.estado) }}
                </span>
              </div>
            </div>
            <div class="pedido-actions">
              <button class="action-btn primary" [routerLink]="['/admintr/pedido', pedido.id]">
                Ver Detalhes
              </button>
              <button 
                *ngIf="pedido.estado === 0" 
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
                *ngIf="pedido.estado === 1" 
                class="action-btn completed" 
                (click)="realizarPedido(pedido)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
                Realizar
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

    .action-btn.secondary {
      background: #4f46e5;
      color: white;
    }

    .action-btn.secondary:hover {
      background: #4338ca;
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
  
  todosPedidos: PedidoMarcacao[] = [];
  pedidosFiltrados: PedidoMarcacao[] = [];

  constructor(private pedidosService: PedidosService) {}

  ngOnInit() {
    this.carregarPedidos();
  }

  carregarPedidos() {
    this.pedidosService.getAll().subscribe({
      next: (pedidos) => {
        this.todosPedidos = pedidos;
        this.aplicarFiltros();
      },
      error: (error) => {
        console.error('Erro ao carregar pedidos:', error);
      }
    });
  }

  aplicarFiltros() {
    let filtrados = [...this.todosPedidos];

    // Filtro por estado
    if (this.filtroEstado) {
      const estadoMap: { [key: string]: number } = {
        'pedido': 0,
        'agendado': 1,
        'realizado': 2
      };
      const estadoNumero = estadoMap[this.filtroEstado];
      if (estadoNumero !== undefined) {
        filtrados = filtrados.filter(p => p.estado === estadoNumero);
      }
    }

    // Filtro por tipo (anónimo vs registado)
    if (this.filtroTipo) {
      if (this.filtroTipo === 'anonimo') {
        filtrados = filtrados.filter(p => p.user?.perfil === 0);
      } else if (this.filtroTipo === 'registado') {
        filtrados = filtrados.filter(p => p.user?.perfil === 1);
      }
    }

    // Filtro por período
    if (this.filtroPeriodo) {
      const hoje = new Date();
      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(hoje.getDate() - hoje.getDay());
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

      filtrados = filtrados.filter(p => {
        if (!p.dataInicioPreferida) return false;
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
      filtrados = filtrados.filter(p => {
        const tipoConsulta = p.actosClinicos && p.actosClinicos.length > 0 ? p.actosClinicos[0].tipo : '';
        const nomeUtente = p.user?.nomeCompleto || '';
        const subsistema = p.actosClinicos && p.actosClinicos.length > 0 ? p.actosClinicos[0].subsistemaSaude : '';
        
        return tipoConsulta.toLowerCase().includes(termo) ||
               nomeUtente.toLowerCase().includes(termo) ||
               subsistema.toLowerCase().includes(termo);
      });
    }

    this.pedidosFiltrados = filtrados;
    this.paginaAtual = 1;
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

  getTotalPedidos(): number {
    return this.todosPedidos.length;
  }

  getPedidosPendentes(): number {
    return this.todosPedidos.filter(p => p.estado === 0).length;
  }

  getPedidosAgendados(): number {
    return this.todosPedidos.filter(p => p.estado === 1).length;
  }

  getPedidosRealizados(): number {
    return this.todosPedidos.filter(p => p.estado === 2).length;
  }

  get totalPaginas(): number {
    return Math.ceil(this.pedidosFiltrados.length / this.itensPorPagina);
  }

  mudarPagina(pagina: number) {
      this.paginaAtual = pagina;
    }

  agendarPedido(pedido: PedidoMarcacao) {
    const nomeUtente = pedido.user?.nomeCompleto || 'Utente';
    if (confirm(`Confirmar agendamento para ${nomeUtente}?`)) {
      if (pedido.id) {
        this.pedidosService.agendar(pedido.id).subscribe({
          next: () => {
            console.log('Pedido agendado com sucesso');
            this.carregarPedidos();
          },
          error: (error) => {
            console.error('Erro ao agendar pedido:', error);
          }
        });
      }
    }
  }

  realizarPedido(pedido: PedidoMarcacao) {
    const nomeUtente = pedido.user?.nomeCompleto || 'Utente';
    if (confirm(`Confirmar realização da consulta para ${nomeUtente}?`)) {
      if (pedido.id) {
        this.pedidosService.realizar(pedido.id).subscribe({
          next: () => {
            console.log('Pedido marcado como realizado');
            this.carregarPedidos();
          },
          error: (error) => {
            console.error('Erro ao marcar pedido como realizado:', error);
          }
        });
      }
    }
  }

  exportarRelatorio() {
    // Criar um relatório com os pedidos filtrados
    const pedidosParaExportar = this.pedidosFiltrados.length > 0 ? this.pedidosFiltrados : this.todosPedidos;
    
    if (pedidosParaExportar.length === 0) {
      alert('Não há pedidos para exportar.');
      return;
    }

    // Gerar PDF
    this.gerarPDF(pedidosParaExportar);
  }

  private gerarPDF(pedidos: PedidoMarcacao[]) {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.setTextColor(0, 84, 141); // #00548d
    doc.text('Relatório de Pedidos de Marcação', 20, 20);
    
    // Data e hora
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const horaAtual = new Date().toLocaleTimeString('pt-BR');
    doc.text(`Gerado em ${dataAtual} às ${horaAtual}`, 20, 30);
    
    // Estatísticas
    doc.setFontSize(14);
    doc.setTextColor(0, 84, 141);
    doc.text('Estatísticas:', 20, 45);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total: ${this.getTotalPedidos()}`, 20, 55);
    doc.text(`Pendentes: ${this.getPedidosPendentes()}`, 20, 65);
    doc.text(`Agendados: ${this.getPedidosAgendados()}`, 20, 75);
    doc.text(`Realizados: ${this.getPedidosRealizados()}`, 20, 85);
    
    // Preparar dados da tabela
    const tableData = pedidos.map(pedido => {
      const nomeUtente = pedido.user?.nomeCompleto || 'Utente Anónimo';
      const tipoConsulta = pedido.actosClinicos && pedido.actosClinicos.length > 0 ? pedido.actosClinicos[0].tipo : 'Consulta';
      const subsistema = pedido.actosClinicos && pedido.actosClinicos.length > 0 ? pedido.actosClinicos[0].subsistemaSaude : '';
      const dataFormatada = pedido.dataInicioPreferida ? new Date(pedido.dataInicioPreferida).toLocaleDateString('pt-BR') : '';
      const estadoLabel = this.getStatusLabel(pedido.estado);
      
      return [
        pedido.id?.toString() || '',
        nomeUtente,
        tipoConsulta,
        dataFormatada,
        pedido.horarioPreferido || '',
        subsistema,
        estadoLabel,
        pedido.observacoes || ''
      ];
    });
    
    // Cabeçalho da tabela
    const headers = [
      'ID',
      'Utente', 
      'Tipo Consulta',
      'Data Preferida',
      'Horário',
      'Subsistema',
      'Estado',
      'Observações'
    ];
    
    // Gerar tabela
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 100,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [0, 84, 141],
        textColor: 255
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });
    
    // Gerar PDF e abrir numa nova aba
    const pdfOutput = doc.output('blob');
    const url = URL.createObjectURL(pdfOutput);
    
    // Abrir numa nova aba
    window.open(url, '_blank');
    
    // Limpar URL após um tempo
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  }
} 