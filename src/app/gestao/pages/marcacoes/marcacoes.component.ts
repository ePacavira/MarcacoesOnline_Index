import { Component, type OnInit, signal } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { AuthService } from "../../../core/services/auth.service"
import { UserProfileService } from "../../../core/services/user-profile.service"

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
          <button class="new-appointment-btn" routerLink="/marcacoes">
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
              <option value="0">Pendentes</option>
              <option value="1">Agendadas</option>
              <option value="2">Realizadas</option>
              <option value="3">Cancelados</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="dateFilter">Período:</label>
            <select id="dateFilter" [(ngModel)]="filtroData" (change)="aplicarFiltros()">
              <option value="">Todos</option>
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 3 meses</option>
              <option value="365">Último ano</option>
            </select>
          </div>
        </div>
        
        <div class="filters-right">
          <div class="search-box">
            <input 
              type="text" 
              [(ngModel)]="termoPesquisa" 
              (input)="aplicarFiltros()"
              placeholder="Pesquisar marcações..."
            />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Estatísticas -->
      <div class="stats-section">
        <div class="stat-item">
          <span class="stat-number">{{ estatisticas().total }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ estatisticas().pendentes }}</span>
          <span class="stat-label">Pendentes</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ estatisticas().agendadas }}</span>
          <span class="stat-label">Agendadas</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ estatisticas().realizadas }}</span>
          <span class="stat-label">Realizadas</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ estatisticas().cancelados }}</span>
          <span class="stat-label">Cancelados</span>
        </div>
      </div>

      <!-- Lista de Marcações -->
      <div class="marcacoes-list">
        @if (isLoading()) {
          <div class="loading-container">
            <svg class="loading-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            <p>A carregar marcações...</p>
          </div>
        } @else if (marcacoesFiltradas().length === 0) {
          <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/>
            </svg>
            <h3>Nenhuma marcação encontrada</h3>
            <p>Não foram encontradas marcações com os filtros aplicados.</p>
            <button class="new-appointment-btn" routerLink="/marcacoes">Fazer Nova Marcação</button>
          </div>
        } @else {
          @for (marcacao of marcacoesFiltradas(); track marcacao.id) {
            <div class="marcacao-card">
              <div class="marcacao-header">
                <div class="marcacao-info">
                  <h3 class="marcacao-title">
                    {{ marcacao.actosClinicos[0]?.tipo || 'Consulta' }}
                  </h3>
                  <p class="marcacao-subtitle">
                    {{ marcacao.actosClinicos[0]?.profissional || 'Médico' }} • 
                    {{ marcacao.actosClinicos[0]?.subsistemaSaude || 'SNS' }}
                  </p>
                </div>
                <div class="marcacao-status">
                  <span class="status-badge" [class]="getStatusClass(marcacao.estado)">
                    {{ getStatusText(marcacao.estado) }}
                  </span>
                </div>
              </div>
              
              <div class="marcacao-details">
                <div class="detail-row">
                  <span class="detail-label">Data Preferida:</span>
                  <span class="detail-value">
                    {{ marcacao.dataInicioPreferida | date:'dd/MM/yyyy' }} - 
                    {{ marcacao.dataFimPreferida | date:'dd/MM/yyyy' }}
                  </span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Horário:</span>
                  <span class="detail-value">{{ marcacao.horarioPreferido }}</span>
                </div>
                @if (marcacao.observacoes) {
                  <div class="detail-row">
                    <span class="detail-label">Observações:</span>
                    <span class="detail-value">{{ marcacao.observacoes }}</span>
                  </div>
                }
                <div class="detail-row">
                  <span class="detail-label">Actos Clínicos:</span>
                  <span class="detail-value">
                    {{ marcacao.actosClinicos.length }} acto(s)
                  </span>
                </div>
              </div>
              
              <div class="marcacao-actions">
                <button class="action-btn secondary" (click)="verDetalhes(marcacao.id)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Ver Detalhes
                </button>
                
                @if (marcacao.estado === 0) {
                  <button class="action-btn danger" (click)="cancelarMarcacao(marcacao.id)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                    Cancelar
                  </button>
                }
                
                <button class="action-btn primary" (click)="exportarPDF(marcacao.id)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                  Exportar PDF
                </button>
              </div>
            </div>
          }
        }
      </div>

      <!-- Modal de confirmação de cancelamento -->
      <div *ngIf="showCancelModal" class="modal-overlay">
        <div class="modal-box">
          <h3>Tem certeza que deseja cancelar esta marcação?</h3>
          <div class="modal-actions">
            <button class="modal-btn danger" (click)="confirmarCancelamento()">Cancelar Marcação</button>
            <button class="modal-btn" (click)="fecharModal()">Fechar</button>
          </div>
        </div>
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
      background: #003a5c;
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
      font-weight: 600;
      color: #374151;
      font-size: 0.9rem;
    }

    .filter-group select {
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-box input {
      padding: 0.5rem 2.5rem 0.5rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.9rem;
      width: 250px;
    }

    .search-box svg {
      position: absolute;
      right: 0.75rem;
      width: 16px;
      height: 16px;
      color: #6b7280;
    }

    .stats-section {
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

    .stat-number {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      color: #00548d;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .marcacoes-list {
      display: grid;
      gap: 1rem;
    }

    .marcacao-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border: 1px solid #e5e7eb;
    }

    .marcacao-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .marcacao-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }

    .marcacao-subtitle {
      color: #6b7280;
      margin: 0;
      font-size: 0.9rem;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .status-badge.pendente {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.agendada {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.realizada {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-badge.cancelado {
      background: #fee2e2;
      color: #991b1b;
    }

    .marcacao-details {
      margin-bottom: 1.5rem;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-label {
      font-weight: 600;
      color: #374151;
    }

    .detail-value {
      color: #6b7280;
    }

    .marcacao-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .action-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }

    .action-btn.primary {
      background: #00548d;
      color: white;
    }

    .action-btn.primary:hover {
      background: #003a5c;
    }

    .action-btn.secondary {
      background: #f3f4f6;
      color: #374151;
    }

    .action-btn.secondary:hover {
      background: #e5e7eb;
    }

    .action-btn.danger {
      background: #fee2e2;
      color: #991b1b;
    }

    .action-btn.danger:hover {
      background: #fecaca;
    }

    .loading-container {
      text-align: center;
      padding: 3rem;
      color: #6b7280;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #6b7280;
    }

    .empty-state svg {
      width: 64px;
      height: 64px;
      margin-bottom: 1rem;
      color: #d1d5db;
    }

    .empty-state h3 {
      margin: 0 0 0.5rem 0;
      color: #374151;
    }

    .empty-state p {
      margin: 0 0 1.5rem 0;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-box {
      background: #fff;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 16px rgba(0,0,0,0.2);
      min-width: 320px;
      text-align: center;
    }
    .modal-actions {
      margin-top: 2rem;
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    .modal-btn {
      padding: 0.5rem 1.5rem;
      border-radius: 6px;
      border: none;
      font-size: 1rem;
      cursor: pointer;
      background: #f3f4f6;
      color: #374151;
      transition: background 0.2s;
    }
    .modal-btn.danger {
      background: #dc2626;
      color: #fff;
    }
    .modal-btn:hover {
      background: #e5e7eb;
    }
    .modal-btn.danger:hover {
      background: #b91c1c;
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
        flex-direction: column;
      }

      .search-box input {
        width: 100%;
      }

      .marcacao-header {
        flex-direction: column;
        gap: 1rem;
      }

      .marcacao-actions {
        justify-content: center;
      }

      .detail-row {
        flex-direction: column;
        gap: 0.25rem;
      }
    }
  `]
})
export class MarcacoesComponent implements OnInit {
  isLoading = signal(false);
  filtroEstado = signal("");
  filtroData = signal("");
  termoPesquisa = signal("");
  todasMarcacoes = signal<any[]>([]);
  marcacoesFiltradas = signal<any[]>([]);
  estatisticas = signal({
    total: 0,
    pendentes: 0,
    agendadas: 0,
    realizadas: 0,
    cancelados: 0
  });
  showCancelModal = false;
  pedidoParaCancelar: number | null = null;

  constructor(
    private authService: AuthService,
    private userProfileService: UserProfileService
  ) {}

  ngOnInit() {
    this.carregarMarcacoes();
  }

  carregarMarcacoes() {
    this.isLoading.set(true);
    
    this.userProfileService.getUserPedidos().subscribe({
      next: (pedidos) => {
        this.todasMarcacoes.set(pedidos);
        this.calcularEstatisticas();
        this.aplicarFiltros();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar marcações:', error);
        this.isLoading.set(false);
      }
    });
  }

  calcularEstatisticas() {
    const pedidos = this.todasMarcacoes();
    const stats = {
      total: pedidos.length,
      pendentes: pedidos.filter(p => p.estado === 0).length,
      agendadas: pedidos.filter(p => p.estado === 1).length,
      realizadas: pedidos.filter(p => p.estado === 2).length,
      cancelados: pedidos.filter(p => p.estado === 3).length
    };
    this.estatisticas.set(stats);
  }

  aplicarFiltros() {
    let filtrados = this.todasMarcacoes();

    // Filtro por estado
    if (this.filtroEstado()) {
      filtrados = filtrados.filter(m => m.estado === parseInt(this.filtroEstado()));
    } else {
      // Por padrão, não mostrar canceladas
      filtrados = filtrados.filter(m => m.estado !== 3);
    }

    // Filtro por data
    if (this.filtroData()) {
      const dias = parseInt(this.filtroData());
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - dias);
      filtrados = filtrados.filter(m => {
        const dataMarcacao = new Date(m.dataInicioPreferida);
        return dataMarcacao >= dataLimite;
      });
    }

    // Filtro por pesquisa
    if (this.termoPesquisa()) {
      const termo = this.termoPesquisa().toLowerCase();
      filtrados = filtrados.filter(m => 
        m.actosClinicos.some((acto: any) => 
          acto.tipo.toLowerCase().includes(termo) ||
          acto.profissional.toLowerCase().includes(termo) ||
          acto.subsistemaSaude.toLowerCase().includes(termo)
        ) ||
        m.observacoes?.toLowerCase().includes(termo)
      );
    }

    this.marcacoesFiltradas.set(filtrados);
  }

  getStatusText(estado: number): string {
    switch (estado) {
      case 0: return 'Pendente';
      case 1: return 'Agendada';
      case 2: return 'Realizada';
      case 3: return 'Cancelado';
      default: return 'Desconhecido';
    }
  }

  getStatusClass(estado: number): string {
    switch (estado) {
      case 0: return 'pendente';
      case 1: return 'agendada';
      case 2: return 'realizada';
      case 3: return 'cancelado';
      default: return 'pendente';
    }
  }

  verDetalhes(id: number) {
    // Implementar navegação para detalhes
    console.log('Ver detalhes do pedido:', id);
  }

  cancelarMarcacao(id: number) {
    this.pedidoParaCancelar = id;
    this.showCancelModal = true;
  }

  fecharModal() {
    this.showCancelModal = false;
    this.pedidoParaCancelar = null;
  }

  confirmarCancelamento() {
    if (this.pedidoParaCancelar !== null) {
      this.userProfileService.cancelPedido(this.pedidoParaCancelar).subscribe({
        next: () => {
          this.carregarMarcacoes();
          this.fecharModal();
        },
        error: (error) => {
          console.error('Erro ao cancelar marcação:', error);
          this.fecharModal();
        }
      });
    }
  }

  exportarPDF(id: number) {
    // Implementar exportação PDF
    console.log('Exportar PDF do pedido:', id);
  }
}
