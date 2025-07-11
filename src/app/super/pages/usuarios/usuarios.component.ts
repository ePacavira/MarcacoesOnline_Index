import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-usuarios",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="usuarios-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Gestão de Utilizadores</h1>
          <p class="page-subtitle">Gerencie todos os utilizadores do sistema</p>
        </div>
        <div class="header-right">
          <button class="add-user-btn" (click)="adicionarUtilizador()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Adicionar Utilizador
          </button>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters-section">
        <div class="filters-left">
          <div class="filter-group">
            <label for="perfilFilter">Perfil:</label>
            <select id="perfilFilter" [(ngModel)]="filtroPerfil" (change)="aplicarFiltros()">
              <option value="">Todos</option>
              <option value="utente">Utente</option>
              <option value="administrativo">Administrativo</option>
              <option value="medico">Médico</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div class="filter-group">
            <label for="statusFilter">Estado:</label>
            <select id="statusFilter" [(ngModel)]="filtroStatus" (change)="aplicarFiltros()">
              <option value="">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="bloqueado">Bloqueado</option>
            </select>
          </div>
          <div class="filter-group">
            <label for="dateFilter">Registado:</label>
            <select id="dateFilter" [(ngModel)]="filtroData" (change)="aplicarFiltros()">
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
              placeholder="Pesquisar utilizadores..." 
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
          <span class="stat-number">{{ getTotalUsuarios() }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-item ativo">
          <span class="stat-number">{{ getUsuariosAtivos() }}</span>
          <span class="stat-label">Ativos</span>
        </div>
        <div class="stat-item inativo">
          <span class="stat-number">{{ getUsuariosInativos() }}</span>
          <span class="stat-label">Inativos</span>
        </div>
        <div class="stat-item bloqueado">
          <span class="stat-number">{{ getUsuariosBloqueados() }}</span>
          <span class="stat-label">Bloqueados</span>
        </div>
      </div>

      <!-- Lista de Utilizadores -->
      <div class="usuarios-list">
        <div *ngFor="let usuario of usuariosFiltrados" class="usuario-item">
          <div class="usuario-header">
            <div class="usuario-info">
              <div class="usuario-avatar">
                <img [src]="getFotoPerfilSrc(usuario)" alt="Avatar" />
              </div>
              <div class="usuario-details">
                <h3>{{ usuario.nome }}</h3>
                <div class="usuario-meta">
                  <span class="detail-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    {{ usuario.email }}
                  </span>
                  <span class="detail-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    {{ usuario.telefone }}
                  </span>
                  <span class="detail-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                    Registado em {{ usuario.dataRegisto | date:'dd/MM/yyyy' }}
                  </span>
                </div>
              </div>
            </div>
            <div class="usuario-meta">
              <span class="perfil-badge" [class]="'perfil-' + usuario.perfil.toLowerCase()">
                {{ getPerfilLabel(usuario.perfil) }}
              </span>
              <span class="status-badge" [class]="'status-' + usuario.status.toLowerCase()">
                {{ getStatusLabel(usuario.status) }}
              </span>
            </div>
          </div>
          
          <div class="usuario-body">
            <div class="usuario-stats">
              <div class="stat-mini">
                <span class="stat-number">{{ usuario.totalPedidos }}</span>
                <span class="stat-label">Pedidos</span>
              </div>
              <div class="stat-mini">
                <span class="stat-number">{{ usuario.ultimoAcesso | date:'dd/MM' }}</span>
                <span class="stat-label">Último Acesso</span>
              </div>
            </div>
          </div>

          <div class="usuario-actions">
            <button class="action-btn primary" (click)="verDetalhes(usuario)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              Ver Detalhes
            </button>
            
            <button class="action-btn secondary" (click)="editarUsuario(usuario)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Editar
            </button>
            
            <button class="action-btn warning" (click)="resetarSenha(usuario)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <circle cx="12" cy="16" r="1"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Resetar Senha
            </button>
            
            <button 
              *ngIf="usuario.status === 'ativo'" 
              class="action-btn danger" 
              (click)="bloquearUsuario(usuario)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <circle cx="12" cy="16" r="1"/>
                <path d="M7 11V7a5 5 0 0 1 9.9-.9"/>
              </svg>
              Bloquear
            </button>
            
            <button 
              *ngIf="usuario.status === 'bloqueado'" 
              class="action-btn success" 
              (click)="desbloquearUsuario(usuario)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <circle cx="12" cy="16" r="1"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Desbloquear
            </button>
            
            <button class="action-btn danger" (click)="eliminarUsuario(usuario)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3,6 5,6 21,6"/>
                <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
              Eliminar
            </button>
          </div>
        </div>

        <!-- Estado vazio -->
        <div *ngIf="usuariosFiltrados.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h3>Nenhum utilizador encontrado</h3>
          <p>Não foram encontrados utilizadores com os filtros aplicados.</p>
        </div>
      </div>

      <!-- Paginação -->
      <div class="pagination" *ngIf="usuariosFiltrados.length > 0">
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
    .usuarios-container {
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

    .add-user-btn {
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

    .add-user-btn:hover {
      background: #059669;
    }

    .add-user-btn svg {
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

    .stat-item.ativo { border-left: 4px solid #10b981; }
    .stat-item.inativo { border-left: 4px solid #6b7280; }
    .stat-item.bloqueado { border-left: 4px solid #ef4444; }

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

    .usuarios-list {
      display: grid;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .usuario-item {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.2s;
    }

    .usuario-item:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .usuario-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .usuario-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
    }

    .usuario-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
    }

    .usuario-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .usuario-details h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 0.5rem 0;
    }

    .usuario-meta {
      display: flex;
      gap: 0.5rem;
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

    .perfil-badge, .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .perfil-utente {
      background: #dbeafe;
      color: #1e40af;
    }

    .perfil-administrativo {
      background: #fef3c7;
      color: #92400e;
    }

    .perfil-medico {
      background: #d1fae5;
      color: #065f46;
    }

    .perfil-admin {
      background: #f3e8ff;
      color: #7c3aed;
    }

    .status-ativo {
      background: #d1fae5;
      color: #065f46;
    }

    .status-inativo {
      background: #f3f4f6;
      color: #6b7280;
    }

    .status-bloqueado {
      background: #fee2e2;
      color: #dc2626;
    }

    .usuario-body {
      border-top: 1px solid #e5e7eb;
      padding-top: 1rem;
      margin-bottom: 1rem;
    }

    .usuario-stats {
      display: flex;
      gap: 2rem;
    }

    .stat-mini {
      text-align: center;
    }

    .stat-mini .stat-number {
      display: block;
      font-size: 1.1rem;
      font-weight: 600;
      color: #00548d;
    }

    .stat-mini .stat-label {
      font-size: 0.8rem;
      color: #666;
    }

    .usuario-actions {
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

    .action-btn.secondary {
      background: transparent;
      color: #00548d;
      border: 1px solid #00548d;
    }

    .action-btn.secondary:hover {
      background: #00548d;
      color: white;
    }

    .action-btn.warning {
      background: #f59e0b;
      color: white;
    }

    .action-btn.warning:hover {
      background: #d97706;
    }

    .action-btn.success {
      background: #10b981;
      color: white;
    }

    .action-btn.success:hover {
      background: #059669;
    }

    .action-btn.danger {
      background: #ef4444;
      color: white;
    }

    .action-btn.danger:hover {
      background: #dc2626;
    }

    .action-btn svg {
      width: 16px;
      height: 16px;
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
      .usuarios-container {
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

      .usuario-header {
        flex-direction: column;
        gap: 1rem;
      }

      .usuario-actions {
        justify-content: center;
      }
    }
  `]
})
export class UsuariosComponent implements OnInit {
  filtroPerfil = '';
  filtroStatus = '';
  filtroData = '';
  termoPesquisa = '';
  paginaAtual = 1;
  itensPorPagina = 10;
  
  todosUsuarios: any[] = [];
  usuariosFiltrados: any[] = [];

  constructor() {}

  ngOnInit() {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    // Mock data - em produção viria do serviço
    this.todosUsuarios = [
      {
        id: 1,
        nome: 'João Silva',
        email: 'joao.silva@email.com',
        telefone: '+351 123 456 789',
        foto: '/assets/default-avatar.png',
        fotoPath: 'https://via.placeholder.com/150',
        perfil: 'utente',
        status: 'ativo',
        dataRegisto: new Date('2023-12-01'),
        ultimoAcesso: new Date('2024-01-15'),
        totalPedidos: 5
      },
      {
        id: 2,
        nome: 'Maria Santos',
        email: 'maria.santos@email.com',
        telefone: '+351 987 654 321',
        foto: '/assets/default-avatar.png',
        fotoPath: 'https://via.placeholder.com/150',
        perfil: 'administrativo',
        status: 'ativo',
        dataRegisto: new Date('2023-11-15'),
        ultimoAcesso: new Date('2024-01-16'),
        totalPedidos: 0
      },
      {
        id: 3,
        nome: 'Dr. Carlos Oliveira',
        email: 'carlos.oliveira@clinica.com',
        telefone: '+351 555 123 456',
        foto: '/assets/default-avatar.png',
        fotoPath: 'https://via.placeholder.com/150',
        perfil: 'medico',
        status: 'ativo',
        dataRegisto: new Date('2023-10-01'),
        ultimoAcesso: new Date('2024-01-16'),
        totalPedidos: 0
      },
      {
        id: 4,
        nome: 'Ana Costa',
        email: 'ana.costa@email.com',
        telefone: '+351 111 222 333',
        foto: '/assets/default-avatar.png',
        fotoPath: 'https://via.placeholder.com/150',
        perfil: 'utente',
        status: 'bloqueado',
        dataRegisto: new Date('2023-12-20'),
        ultimoAcesso: new Date('2024-01-10'),
        totalPedidos: 2
      }
    ];
    
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let filtradas = [...this.todosUsuarios];

    // Filtro por perfil
    if (this.filtroPerfil) {
      filtradas = filtradas.filter(u => 
        u.perfil.toLowerCase() === this.filtroPerfil.toLowerCase()
      );
    }

    // Filtro por status
    if (this.filtroStatus) {
      filtradas = filtradas.filter(u => 
        u.status.toLowerCase() === this.filtroStatus.toLowerCase()
      );
    }

    // Filtro por data
    if (this.filtroData) {
      const hoje = new Date();
      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(hoje.getDate() - hoje.getDay());
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

      filtradas = filtradas.filter(u => {
        const dataRegisto = new Date(u.dataRegisto);
        switch (this.filtroData) {
          case 'hoje':
            return dataRegisto.toDateString() === hoje.toDateString();
          case 'semana':
            return dataRegisto >= inicioSemana;
          case 'mes':
            return dataRegisto >= inicioMes;
          default:
            return true;
        }
      });
    }

    // Filtro por pesquisa
    if (this.termoPesquisa) {
      const termo = this.termoPesquisa.toLowerCase();
      filtradas = filtradas.filter(u =>
        u.nome.toLowerCase().includes(termo) ||
        u.email.toLowerCase().includes(termo) ||
        u.telefone.includes(termo)
      );
    }

    this.usuariosFiltrados = filtradas;
    this.paginaAtual = 1;
  }

  getPerfilLabel(perfil: string): string {
    const labels: { [key: string]: string } = {
      'utente': 'Utente',
      'administrativo': 'Administrativo',
      'medico': 'Médico',
      'admin': 'Administrador'
    };
    return labels[perfil] || perfil;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'ativo': 'Ativo',
      'inativo': 'Inativo',
      'bloqueado': 'Bloqueado'
    };
    return labels[status] || status;
  }

  getTotalUsuarios(): number {
    return this.todosUsuarios.length;
  }

  getUsuariosAtivos(): number {
    return this.todosUsuarios.filter(u => u.status === 'ativo').length;
  }

  getUsuariosInativos(): number {
    return this.todosUsuarios.filter(u => u.status === 'inativo').length;
  }

  getUsuariosBloqueados(): number {
    return this.todosUsuarios.filter(u => u.status === 'bloqueado').length;
  }

  get totalPaginas(): number {
    return Math.ceil(this.usuariosFiltrados.length / this.itensPorPagina);
  }

  mudarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
    }
  }

  adicionarUtilizador() {
    console.log('Adicionar utilizador');
    alert('Funcionalidade de adicionar utilizador em desenvolvimento.');
  }

  verDetalhes(usuario: any) {
    console.log('Ver detalhes do utilizador:', usuario);
    alert('Funcionalidade de ver detalhes em desenvolvimento.');
  }

  editarUsuario(usuario: any) {
    console.log('Editar utilizador:', usuario);
    alert('Funcionalidade de editar utilizador em desenvolvimento.');
  }

  resetarSenha(usuario: any) {
    if (confirm(`Resetar senha para ${usuario.nome}?`)) {
      console.log('Resetar senha:', usuario);
      alert('Senha resetada com sucesso! Email enviado com nova senha.');
    }
  }

  bloquearUsuario(usuario: any) {
    if (confirm(`Bloquear utilizador ${usuario.nome}?`)) {
      console.log('Bloquear utilizador:', usuario);
      alert('Utilizador bloqueado com sucesso!');
    }
  }

  desbloquearUsuario(usuario: any) {
    if (confirm(`Desbloquear utilizador ${usuario.nome}?`)) {
      console.log('Desbloquear utilizador:', usuario);
      alert('Utilizador desbloqueado com sucesso!');
    }
  }

  eliminarUsuario(usuario: any) {
    if (confirm(`Eliminar utilizador ${usuario.nome}? Esta ação não pode ser desfeita.`)) {
      console.log('Eliminar utilizador:', usuario);
      alert('Utilizador eliminado com sucesso!');
    }
  }

  getFotoPerfilSrc(usuario: any): string {
    const foto = usuario.fotoPath || usuario.foto;
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