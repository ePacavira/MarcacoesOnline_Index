import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { AuthService } from "../../../core/services/auth.service"
import { MarcacaoService } from "../../../core/services/marcacao.service"
import { HttpClient } from "@angular/common/http"

@Component({
  selector: "app-marcacoes",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="marcacoes-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Minhas Marcações</h1>
          <p class="page-subtitle">Gerencie todas as suas consultas e marcações</p>
        </div>
        <div class="header-right">
          <button class="new-appointment-btn" routerLink="/marcacao-anonima">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nova Marcação
          </button>
        </div>
      </div>

      <!-- Filtros e Estatísticas -->
      <div class="filters-section">
        <div class="filters-left">
          <div class="filter-group">
            <label for="statusFilter">Estado:</label>
            <select id="statusFilter" [(ngModel)]="filtroEstado" (change)="aplicarFiltros()">
              <option value="">Todos</option>
              <option value="pendente">Pendentes</option>
              <option value="confirmada">Confirmadas</option>
              <option value="cancelada">Canceladas</option>
              <option value="realizada">Realizadas</option>
            </select>
          </div>
          <div class="filter-group">
            <label for="dateFilter">Período:</label>
            <select id="dateFilter" [(ngModel)]="filtroPeriodo" (change)="aplicarFiltros()">
              <option value="">Todos</option>
              <option value="hoje">Hoje</option>
              <option value="semana">Esta Semana</option>
              <option value="mes">Este Mês</option>
              <option value="passado">Passado</option>
            </select>
          </div>
        </div>
        <div class="filters-right">
          <div class="search-box">
            <input 
              type="text" 
              placeholder="Pesquisar marcações..." 
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

      <!-- Estatísticas Rápidas -->
      <div class="stats-overview">
        <div class="stat-item">
          <span class="stat-number">{{ getTotalMarcacoes() }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-item pending">
          <span class="stat-number">{{ getMarcacoesPendentes() }}</span>
          <span class="stat-label">Pendentes</span>
        </div>
        <div class="stat-item confirmed">
          <span class="stat-number">{{ getMarcacoesConfirmadas() }}</span>
          <span class="stat-label">Confirmadas</span>
        </div>
        <div class="stat-item completed">
          <span class="stat-number">{{ getMarcacoesRealizadas() }}</span>
          <span class="stat-label">Realizadas</span>
        </div>
      </div>

      <!-- Lista de Marcações -->
      <div class="marcacoes-list">
        <div *ngFor="let marcacao of marcacoesFiltradas" class="marcacao-item">
          <div class="marcacao-header">
            <div class="marcacao-date">
              <div class="date-circle">
                <span class="day">{{ marcacao.dataInicioPreferida | date:'dd' }}</span>
                <span class="month">{{ marcacao.dataInicioPreferida | date:'MMM' }}</span>
              </div>
            </div>
            <div class="marcacao-info">
              <h3 class="marcacao-title">{{ marcacao.tipoConsulta }}</h3>
              <div class="marcacao-details">
                <span class="detail-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                  {{ marcacao.horarioPreferido }}
                </span>
                <span class="detail-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  {{ marcacao.medico }}
                </span>
                <span class="detail-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {{ marcacao.local }}
                </span>
              </div>
            </div>
            <div class="marcacao-status">
              <span class="status-badge" [class]="'status-' + marcacao.estado.toLowerCase()">
                {{ getStatusLabel(marcacao.estado) }}
              </span>
            </div>
          </div>
          
          <div class="marcacao-body">
            <div class="marcacao-notes" *ngIf="marcacao.observacoes">
              <strong>Observações:</strong> {{ marcacao.observacoes }}
            </div>
            <div class="marcacao-actions">
              <button class="action-btn primary" (click)="verDetalhes(marcacao)">
                Ver Detalhes
              </button>
              <button 
                class="action-btn secondary" 
                (click)="cancelarMarcacao(marcacao)"
                *ngIf="marcacao.estado === 'Confirmada' || marcacao.estado === 'Pendente'"
              >
                Cancelar
              </button>
              <button 
                class="action-btn success" 
                (click)="reagendarMarcacao(marcacao)"
                *ngIf="marcacao.estado === 'Confirmada'"
              >
                Reagendar
              </button>
              <button 
                class="action-btn pdf" 
                (click)="exportarPDF(marcacao)"
                [disabled]="exportandoPDF === marcacao.id"
              >
                <svg *ngIf="exportandoPDF !== marcacao.id" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
                <svg *ngIf="exportandoPDF === marcacao.id" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinning">
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                {{ exportandoPDF === marcacao.id ? 'Exportando...' : 'Exportar PDF' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Estado vazio -->
        <div *ngIf="marcacoesFiltradas.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          <h3>Nenhuma marcação encontrada</h3>
          <p>Não foram encontradas marcações com os filtros aplicados.</p>
          <button class="new-appointment-btn" routerLink="/marcacao-anonima">
            Fazer Primeira Marcação
          </button>
        </div>
      </div>

      <!-- Paginação -->
      <div class="pagination" *ngIf="marcacoesFiltradas.length > 0">
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
    .marcacoes-container {
      padding: 2rem;
      max-width: 1200px;
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

    .new-appointment-btn {
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

    .new-appointment-btn:hover {
      background: #0077cc;
    }

    .new-appointment-btn svg {
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

    .stat-item.pending { border-left: 4px solid #f59e0b; }
    .stat-item.confirmed { border-left: 4px solid #10b981; }
    .stat-item.completed { border-left: 4px solid #3b82f6; }

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

    .marcacoes-list {
      display: grid;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .marcacao-item {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.2s;
    }

    .marcacao-item:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .marcacao-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .date-circle {
      width: 60px;
      height: 60px;
      background: #e6f1fa;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #00548d;
    }

    .date-circle .day {
      font-size: 1.2rem;
      font-weight: 700;
      line-height: 1;
    }

    .date-circle .month {
      font-size: 0.7rem;
      text-transform: uppercase;
    }

    .marcacao-info {
      flex: 1;
    }

    .marcacao-title {
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 0.5rem 0;
    }

    .marcacao-details {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
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

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .status-pendente {
      background: #fef3c7;
      color: #92400e;
    }

    .status-confirmada {
      background: #d1fae5;
      color: #065f46;
    }

    .status-cancelada {
      background: #fee2e2;
      color: #991b1b;
    }

    .status-realizada {
      background: #dbeafe;
      color: #1e40af;
    }

    .marcacao-body {
      border-top: 1px solid #e5e7eb;
      padding-top: 1rem;
    }

    .marcacao-notes {
      margin-bottom: 1rem;
      padding: 0.75rem;
      background: #f8f9fa;
      border-radius: 6px;
      font-size: 0.9rem;
      color: #666;
    }

    .marcacao-actions {
      display: flex;
      gap: 0.75rem;
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

    .action-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .action-btn.primary {
      background: #00548d;
      color: white;
    }

    .action-btn.primary:hover:not(:disabled) {
      background: #0077cc;
    }

    .action-btn.secondary {
      background: transparent;
      color: #dc2626;
      border: 1px solid #dc2626;
    }

    .action-btn.secondary:hover:not(:disabled) {
      background: #dc2626;
      color: white;
    }

    .action-btn.success {
      background: transparent;
      color: #059669;
      border: 1px solid #059669;
    }

    .action-btn.success:hover:not(:disabled) {
      background: #059669;
      color: white;
    }

    .action-btn.pdf {
      background: transparent;
      color: #dc2626;
      border: 1px solid #dc2626;
    }

    .action-btn.pdf:hover:not(:disabled) {
      background: #dc2626;
      color: white;
    }

    .action-btn.pdf svg {
      width: 16px;
      height: 16px;
    }

    .spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
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
      .marcacoes-container {
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

      .marcacao-header {
        flex-direction: column;
        text-align: center;
      }

      .marcacao-details {
        justify-content: center;
      }

      .marcacao-actions {
        justify-content: center;
      }
    }
  `]
})
export class MarcacoesComponent implements OnInit {
  filtroEstado = '';
  filtroPeriodo = '';
  termoPesquisa = '';
  paginaAtual = 1;
  itensPorPagina = 10;
  exportandoPDF: number | null = null;
  
  todasMarcacoes: any[] = [];
  marcacoesFiltradas: any[] = [];

  constructor(
    private authService: AuthService,
    private marcacaoService: MarcacaoService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.carregarMarcacoes();
  }

  carregarMarcacoes() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.marcacaoService.getMarcacoesUtente(user.id).subscribe(marcacoes => {
        this.todasMarcacoes = marcacoes;
        this.aplicarFiltros();
      });
    }
  }

  aplicarFiltros() {
    let filtradas = [...this.todasMarcacoes];

    // Filtro por estado
    if (this.filtroEstado) {
      filtradas = filtradas.filter(m => 
        m.estado.toLowerCase() === this.filtroEstado.toLowerCase()
      );
    }

    // Filtro por período
    if (this.filtroPeriodo) {
      const hoje = new Date();
      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(hoje.getDate() - hoje.getDay());
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

      filtradas = filtradas.filter(m => {
        const dataMarcacao = new Date(m.dataInicioPreferida);
        switch (this.filtroPeriodo) {
          case 'hoje':
            return dataMarcacao.toDateString() === hoje.toDateString();
          case 'semana':
            return dataMarcacao >= inicioSemana;
          case 'mes':
            return dataMarcacao >= inicioMes;
          case 'passado':
            return dataMarcacao < hoje;
          default:
            return true;
        }
      });
    }

    // Filtro por pesquisa
    if (this.termoPesquisa) {
      const termo = this.termoPesquisa.toLowerCase();
      filtradas = filtradas.filter(m =>
        m.tipoConsulta.toLowerCase().includes(termo) ||
        m.medico.toLowerCase().includes(termo) ||
        m.local.toLowerCase().includes(termo)
      );
    }

    this.marcacoesFiltradas = filtradas;
    this.paginaAtual = 1;
  }

  getStatusLabel(estado: string): string {
    const labels: { [key: string]: string } = {
      'Pendente': 'Pendente',
      'Confirmada': 'Confirmada',
      'Cancelada': 'Cancelada',
      'Realizada': 'Realizada'
    };
    return labels[estado] || estado;
  }

  getTotalMarcacoes(): number {
    return this.todasMarcacoes.length;
  }

  getMarcacoesPendentes(): number {
    return this.todasMarcacoes.filter(m => m.estado === 'Pendente').length;
  }

  getMarcacoesConfirmadas(): number {
    return this.todasMarcacoes.filter(m => m.estado === 'Confirmada').length;
  }

  getMarcacoesRealizadas(): number {
    return this.todasMarcacoes.filter(m => m.estado === 'Realizada').length;
  }

  get totalPaginas(): number {
    return Math.ceil(this.marcacoesFiltradas.length / this.itensPorPagina);
  }

  mudarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
    }
  }

  verDetalhes(marcacao: any) {
    console.log('Ver detalhes da marcação:', marcacao);
    // Implementar modal ou navegação para detalhes
  }

  cancelarMarcacao(marcacao: any) {
    if (confirm('Tem certeza que deseja cancelar esta marcação?')) {
      console.log('Cancelar marcação:', marcacao);
      // Implementar lógica de cancelamento
    }
  }

  reagendarMarcacao(marcacao: any) {
    console.log('Reagendar marcação:', marcacao);
    // Implementar navegação para reagendamento
  }

  exportarPDF(marcacao: any) {
    this.exportandoPDF = marcacao.id;
    
    // Simular chamada à API
    setTimeout(() => {
      // Em produção, usar a rota real:
      // this.http.get(`/api/PedidoMarcacao/${marcacao.id}/exportar`, { responseType: 'blob' })
      //   .subscribe(blob => {
      //     const url = window.URL.createObjectURL(blob);
      //     const link = document.createElement('a');
      //     link.href = url;
      //     link.download = `marcacao-${marcacao.codigoReferencia}.pdf`;
      //     link.click();
      //     window.URL.revokeObjectURL(url);
      //     this.exportandoPDF = null;
      //   });
      
      // Simulação para desenvolvimento
      console.log('Exportando PDF para marcação:', marcacao.id);
      alert(`PDF da marcação ${marcacao.codigoReferencia} exportado com sucesso!`);
      this.exportandoPDF = null;
    }, 2000);
}
}
