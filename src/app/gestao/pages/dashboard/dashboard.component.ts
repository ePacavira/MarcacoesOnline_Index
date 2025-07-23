import { Component, type OnInit, signal } from "@angular/core"
import { CommonModule } from "@angular/common"
import { AuthService } from "../../../core/services/auth.service"
import { UserProfileService } from "../../../core/services/user-profile.service"
import { PedidoMarcacao } from '../../../models/marcacao.interface';
import { Router } from '@angular/router';

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
      <div class="stats-row stats-row-centered">
        <div class="stat-card">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ totalPendentes }}</h3>
            <p class="stat-label">Marcações <br>Pendentes</p>
            <span class="stat-change neutral">Aguardar confirmação</span>
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
            <p class="stat-label">Consultas <br>Realizadas</p>
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
            <button class="view-all-btn" (click)="logVerTodas()">Ver Todas</button>
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

      <!-- Modal de Detalhes da Marcação -->
      <div *ngIf="detalheModalAberto" class="modal-overlay">
        <div class="modal-box">
          <h3 class="modal-title">Detalhes da Marcação</h3>
          <ng-container *ngIf="detalheMarcacao; else noData">
            <div class="detail-item">
              <span class="detail-label">Código de Referência:</span>
              <span class="detail-value">{{ detalheMarcacao.codigoReferencia || 'Sem dados' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Estado:</span>
              <span class="detail-value">{{ detalheMarcacao.estado !== undefined && detalheMarcacao.estado !== null ? getStatusText(detalheMarcacao.estado) : 'Sem dados' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Data de Início:</span>
              <span class="detail-value">{{ detalheMarcacao.dataInicioPreferida ? (detalheMarcacao.dataInicioPreferida | date:'dd/MM/yyyy HH:mm') : 'Sem dados' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Data de Fim:</span>
              <span class="detail-value">{{ detalheMarcacao.dataFimPreferida ? (detalheMarcacao.dataFimPreferida | date:'dd/MM/yyyy HH:mm') : 'Sem dados' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Horário Preferido:</span>
              <span class="detail-value">{{ detalheMarcacao.horarioPreferido || 'Sem dados' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Observações:</span>
              <span class="detail-value">{{ detalheMarcacao.observacoes ? detalheMarcacao.observacoes : 'Sem observações' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Actos Clínicos:</span>
              <div class="actos-list">
                <ng-container *ngIf="detalheMarcacao.actosClinicos && detalheMarcacao.actosClinicos.length > 0; else noActos">
                  <div class="acto-item" *ngFor="let acto of detalheMarcacao.actosClinicos; trackBy: trackById">
                    <span class="acto-type">{{ acto.tipo || 'Sem tipo' }}</span>
                    <span class="acto-professional">{{ acto.profissional || 'Sem profissional' }}</span>
                    <span class="acto-subsistema">{{ acto.subsistemaSaude || 'Sem subsistema' }}</span>
                  </div>
                </ng-container>
                <ng-template #noActos>
                  <span class="detail-value">Sem actos clínicos</span>
                </ng-template>
              </div>
            </div>
          </ng-container>
          <ng-template #noData>
            <p class="loading-message">A carregar detalhes...</p>
          </ng-template>
          <div class="modal-actions">
            <button class="modal-btn" (click)="fecharModalDetalhe()">Fechar</button>
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
    .stats-row {
      display: flex;
      flex-direction: row;
      gap: 1.2rem;
      margin-bottom: 2rem;
      flex-wrap: nowrap;
      align-items: stretch;
    }
    .stats-row-centered {
      max-width: 1100px;
      margin: 1.2rem auto 2.2rem auto;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: stretch;
      gap: 2rem;
      width: 100%;
    }
    .stat-card {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.08);
      padding: 1.2rem 1.1rem 1rem 1.1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 180px;
      max-width: 220px;
      flex: 1 1 0;
      transition: box-shadow 0.2s;
      }
    .stat-card:hover {
      box-shadow: 0 4px 24px rgba(0,84,141,0.13);
    }
    .stat-card .stat-number {
      font-size: 2.1rem;
      font-weight: 700;
      margin-bottom: 0.2rem;
      color: #00548d;
    }
    .stat-card .stat-label {
      color: #888;
      font-size: 1rem;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    .stat-card .stat-change {
      font-size: 0.95rem;
      font-weight: 400;
      }
    @media (max-width: 1100px) {
      .stats-row-centered {
        max-width: 100%;
        padding: 0 1rem;
        gap: 1rem;
      }
      .stat-card {
        min-width: 160px;
        max-width: 180px;
        flex: 1 1 0;
      }
    }
    @media (max-width: 900px) {
      .stats-row-centered {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
      .stat-card {
        min-width: 100%;
        max-width: 100%;
        flex: 1 1 100%;
      }
    }
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-box {
      background: #fff;
      border-radius: 12px;
      padding: 2rem 2.5rem;
      min-width: 380px;
      max-width: 600px;
      box-shadow: 0 4px 32px rgba(0,0,0,0.18);
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
      align-items: flex-start;
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      margin-top: 1.2rem;
    }
    .modal-btn {
      background: #00548d;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 0.5rem 1.2rem;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
      margin-left: 0.5rem;
    }
    .modal-btn:hover {
      background: #003a5c;
    }
    .detail-item {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }
    .detail-label {
      font-weight: 600;
      color: #374151;
      min-width: 140px;
    }
    .detail-value {
      color: #6b7280;
    }
    .actos-list {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    .acto-item {
      display: flex;
      gap: 0.7rem;
      font-size: 0.97rem;
      color: #444;
    }
    .acto-type {
      font-weight: 600;
      color: #00548d;
    }
    .acto-professional {
      color: #1b5e20;
    }
    .acto-subsistema {
      color: #888;
    }
    .loading-message, .error-message {
      color: #e64a19;
      font-size: 1rem;
      margin: 1rem 0;
    }
    .modal-title {
      font-size: 1.4rem;
      font-weight: 700;
      color: #00548d;
      margin-bottom: 0.7rem;
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
  detalheModalAberto = false;
  detalheMarcacao: any = null;

  // Avatar padrão em base64 (imagem simples de 1x1 pixel transparente)
  private readonly DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjMDA1NDhEIi8+CjxwYXRoIGQ9Ik0yMCA4MEMyMCA2NS4zNzIgMzEuMzcyIDU0IDQ2IDU0SDU0QzY4LjYyOCA1NCA4MCA2NS4zNzIgODBWNzBIMjBWODBaIiBmaWxsPSIjMDA1NDhEIi8+Cjwvc3ZnPgo=';

  constructor(
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    
    // Se não há foto no servidor, tenta obter do localStorage
    if (this.currentUser && (!this.currentUser.fotoPath || this.currentUser.fotoPath.trim() === '')) {
      const localPhoto = this.userProfileService.getPhotoLocally(this.currentUser.id);
      if (localPhoto) {
        this.currentUser.fotoPath = localPhoto;
        console.log('Foto carregada do localStorage no dashboard');
      }
    }

    this.carregarDadosUtente();
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

  carregarMarcacoesUtente() {
    const user = this.authService.getCurrentUser();
    // Remover a chamada para marcacaoService.getMarcacoes()
    // A lógica de carregamento de marcacoes agora é feita diretamente no ngOnInit
    // e a atualização das estatísticas e próximas marcacoes é feita dentro do subscribe.
    // A lógica de filtragem e ordenação das marcacoes é mantida.
    this.marcacoes = this.marcacoes.filter(m => String(m.userId) === String(user?.id));
    console.log('Marcações filtradas:', this.marcacoes);

    // Estatísticas
    this.totalPendentes = this.marcacoes.filter(m => m.estado === 0).length;
    this.totalAgendadas = this.marcacoes.filter(m => m.estado === 1).length;
    this.totalRealizadas = this.marcacoes.filter(m => m.estado === 2).length;

    // Próximas marcações (as 3 mais recentes, estados 0, 1, 2)
    const proximos = this.marcacoes
      .filter(m => [0, 1, 2].includes(m.estado))
      .sort((a, b) => new Date(b.dataInicioPreferida).getTime() - new Date(a.dataInicioPreferida).getTime())
      .slice(0, 3);
    this.proximasMarcacoes.set(proximos);
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
    const marc = this.marcacoes.find(m => m.id == id);
    this.detalheMarcacao = marc || null;
    this.detalheModalAberto = true;
  }

  fecharModalDetalhe() {
    this.detalheModalAberto = false;
    this.detalheMarcacao = null;
  }

  logVerTodas() {
    console.log('Botão Ver Todas clicado!');
    this.router.navigate(['/utente/minhas-marcacoes']);
  }

  getFotoPerfilSrc(): string {
    const foto = this.currentUser?.fotoPath;
    
    // Se não há foto definida, usar avatar padrão
    if (!foto || foto.trim() === '') {
      return this.DEFAULT_AVATAR;
    }

      let url = foto;
    
    // Se é uma imagem base64, usar diretamente
    if (url.startsWith('data:image/')) {
      return url;
    }
    
    // Se é uma URL completa, usar diretamente
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url + '?t=' + Date.now();
    }
    
    // Se é um caminho relativo que começa com /, usar como está
    if (url.startsWith('/')) {
      return url + '?t=' + Date.now();
    }
    
    // Se é uma URL do localhost, usar como está
    if (url.includes('localhost')) {
      return url + '?t=' + Date.now();
    }
    
    // Para qualquer outro caso, usar avatar padrão
    return this.DEFAULT_AVATAR;
  }

  trackById(index: number, item: any) { return item.id; }
}
