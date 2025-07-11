import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { UsersService } from '../../../core/services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: "app-usuarios",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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
                <img [src]="usuario.fotoUrl" alt="Avatar" />
              </div>
              <div class="usuario-details">
                <h3>{{ usuario.nomeCompleto || usuario.nome }}</h3>
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
                    {{ usuario.telefone || usuario.telemovel || 'N/A' }}
                  </span>
                  <span class="detail-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                    {{ usuario.createdAt ? (usuario.createdAt | date:'dd/MM/yyyy') : 'N/A' }}
                  </span>
                </div>
              </div>
            </div>
            <div class="usuario-meta">
              <span class="perfil-badge" [class]="'perfil-' + getPerfilKey(usuario.perfil)">
                {{ getPerfilLabel(usuario.perfil) }}
              </span>
              <span class="status-badge" [class]="'status-' + getStatusKey(usuario.perfil)">
                {{ getStatusLabel(getStatusKey(usuario.perfil)) }}
              </span>
            </div>
          </div>
          
          <div class="usuario-body">
            <div class="usuario-stats">
              <div class="stat-mini">
                <span class="stat-number">{{ usuario.numeroUtente || 'N/A' }}</span>
                <span class="stat-label">Nº Utente</span>
              </div>
              <div class="stat-mini">
                <span class="stat-number">{{ usuario.genero || 'N/A' }}</span>
                <span class="stat-label">Género</span>
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
            <button class="action-btn danger" (click)="eliminarUsuario(usuario)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3,6 5,6 21,6"/>
                <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
              Eliminar
            </button>
            <button *ngIf="getStatusKey(usuario.perfil) === 'inativo'" class="action-btn success" (click)="ativarUsuario(usuario)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Ativar
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

      <!-- Modal de Detalhes do Utilizador -->
      <div class="modal-backdrop" *ngIf="detalheAberto" (click)="fecharDetalhe()"></div>
      <div class="modal-detalhe" *ngIf="detalheAberto">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-avatar">
              <img [src]="utilizadorSelecionado.fotoUrl" alt="Avatar" />
            </div>
            <div class="modal-maininfo">
              <h2>{{ utilizadorSelecionado.nomeCompleto || utilizadorSelecionado.nome }}</h2>
              <p class="modal-email">{{ utilizadorSelecionado.email }}</p>
            </div>
          </div>
          <hr />
          <div class="modal-grid">
            <div>
              <span class="modal-label">Telefone:</span>
              <span>{{ utilizadorSelecionado.telefone || utilizadorSelecionado.telemovel || 'N/A' }}</span>
            </div>
            <div>
              <span class="modal-label">Nº Utente:</span>
              <span>{{ utilizadorSelecionado.numeroUtente || 'N/A' }}</span>
            </div>
            <div>
              <span class="modal-label">Género:</span>
              <span>{{ utilizadorSelecionado.genero || 'N/A' }}</span>
            </div>
            <div>
              <span class="modal-label">Perfil:</span>
              <span>{{ getPerfilLabel(utilizadorSelecionado.perfil) }}</span>
            </div>
            <div>
              <span class="modal-label">Status:</span>
              <span class="status-badge-modal" [ngClass]="getStatusKey(utilizadorSelecionado.perfil)">
                {{ getStatusLabel(getStatusKey(utilizadorSelecionado.perfil)) }}
              </span>
            </div>
            <div>
              <span class="modal-label">Data de Registo:</span>
              <span>{{ utilizadorSelecionado.createdAt ? (utilizadorSelecionado.createdAt | date:'dd/MM/yyyy') : 'N/A' }}</span>
            </div>
          </div>
          <button class="close-btn" (click)="fecharDetalhe()">Fechar</button>
        </div>
      </div>

      <!-- Modal de Edição do Utilizador -->
      <div class="modal-backdrop" *ngIf="editarAberto" (click)="fecharEditar()"></div>
      <div class="modal-detalhe" *ngIf="editarAberto">
        <form class="modal-content" [formGroup]="editForm" (ngSubmit)="guardarEdicao()" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-avatar">
              <img [src]="utilizadorEdicao.fotoUrl" alt="Avatar" />
            </div>
            <div class="modal-maininfo">
              <h2>Editar Utilizador</h2>
              <p class="modal-email">{{ utilizadorEdicao?.email }}</p>
            </div>
          </div>
          <hr />
          <div class="modal-grid">
            <div>
              <label class="modal-label">Nome Completo</label>
              <input class="input" formControlName="nomeCompleto" required />
            </div>
            <div>
              <label class="modal-label">Email</label>
              <input class="input" formControlName="email" type="email" required />
            </div>
            <div>
              <label class="modal-label">Telefone</label>
              <input class="input" formControlName="telemovel" />
            </div>
            <div>
              <label class="modal-label">Data de Nascimento</label>
              <input class="input" formControlName="dataNascimento" type="date" />
            </div>
            <div>
              <label class="modal-label">Género</label>
              <select class="input" formControlName="genero">
                <option value="">Selecionar</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
                <option value="PrefiroNaoIndicar">Prefiro não indicar</option>
              </select>
            </div>
            <div>
              <label class="modal-label">Morada</label>
              <input class="input" formControlName="morada" />
            </div>
          </div>
          <div style="display: flex; gap: 1rem; justify-content: flex-end;">
            <button type="button" class="close-btn" (click)="fecharEditar()">Cancelar</button>
            <button type="submit" class="close-btn" [disabled]="editForm.invalid">Guardar</button>
          </div>
        </form>
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

    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.3);
      z-index: 1000;
    }
    .modal-detalhe {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: #f3f4f6;
      border-radius: 16px;
      box-shadow: 0 2px 24px rgba(0,0,0,0.18);
      z-index: 1001;
      min-width: 320px;
      max-width: 90vw;
      padding: 2.5rem 2rem 2rem 2rem;
      /* Removida a borda colorida */
      overflow: hidden;
    }
    .modal-detalhe::before {
      content: '';
      display: block;
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 6px;
      background: #00548d;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      z-index: 1;
    }
    .modal-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      position: relative;
      z-index: 2;
    }
    .modal-header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 1rem;
    }
    .modal-avatar img {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #e5e7eb;
      background: #fff;
      box-shadow: 0 2px 8px #00548d22;
    }
    .modal-maininfo h2 {
      margin: 0;
      font-size: 1.6rem;
      color: #00548d;
      font-weight: 700;
    }
    .modal-email {
      color: #f59e0b;
      font-size: 1.05rem;
      margin: 0.25rem 0 0 0;
      font-weight: 500;
    }
    hr {
      border: none;
      border-top: 1.5px solid #e5e7eb;
      margin: 1rem 0;
    }
    .modal-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.1rem 2.2rem;
      margin-bottom: 1.5rem;
    }
    .modal-label {
      font-weight: 700;
      color: #00548d;
      margin-right: 0.5rem;
      letter-spacing: 0.01em;
    }
    .status-badge-modal {
      display: inline-block;
      padding: 0.25em 1em;
      border-radius: 999px;
      font-size: 0.95em;
      font-weight: 600;
      margin-left: 0.5em;
    }
    .status-badge-modal.ativo {
      background: #059669;
      color: #fff;
    }
    .status-badge-modal.inativo {
      background: #e5e7eb;
      color: #6b7280;
    }
    .close-btn {
      margin-top: 1rem;
      background: #00548d;
      color: white;
      border: none;
      padding: 0.6rem 2rem;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      align-self: flex-end;
      font-weight: 600;
      box-shadow: 0 2px 8px #00548d22;
      transition: background 0.2s;
    }
    .close-btn:hover {
      background: #3b82f6;
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

    @media (max-width: 600px) {
      .modal-content {
        padding: 1rem !important;
      }
      .modal-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
      .modal-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
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
  detalheAberto = false;
  utilizadorSelecionado: any = null;
  editarAberto = false;
  utilizadorEdicao: any = null;
  editForm: any;

  constructor(private usersService: UsersService, private fb: FormBuilder) {}

  ngOnInit() {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.usersService.getAllUsers().subscribe((usuarios: any[]) => {
      this.todosUsuarios = usuarios.map(u => ({
        ...u,
        fotoUrl: this.gerarFotoUrl(u)
      }));
      this.aplicarFiltros();
    });
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

  getPerfilLabel(perfil: number): string {
    const labels: { [key: number]: string } = {
      0: 'Anónimo',
      1: 'Registado',
      2: 'Administrativo',
      3: 'Administrador'
    };
    return labels[perfil] || 'Desconhecido';
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
    // Total excluindo administradores (perfil 3)
    return this.todosUsuarios.filter(u => u.perfil !== 3).length;
  }

  getUsuariosAtivos(): number {
    // Apenas utilizadores registados (perfil 1)
    return this.todosUsuarios.filter(u => u.perfil === 1).length;
  }

  getUsuariosInativos(): number {
    // Apenas utilizadores anónimos (perfil 0)
    return this.todosUsuarios.filter(u => u.perfil === 0).length;
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
    this.utilizadorSelecionado = usuario;
    this.detalheAberto = true;
  }

  fecharDetalhe() {
    this.detalheAberto = false;
    this.utilizadorSelecionado = null;
  }

  editarUsuario(usuario: any) {
    this.utilizadorEdicao = { ...usuario };
    this.editForm = this.fb.group({
      nomeCompleto: [usuario.nomeCompleto || '', Validators.required],
      email: [usuario.email || '', [Validators.required, Validators.email]],
      telemovel: [usuario.telemovel || '', []],
      dataNascimento: [usuario.dataNascimento ? usuario.dataNascimento.split('T')[0] : '', []],
      genero: [usuario.genero || '', []],
      morada: [usuario.morada || '', []]
    });
    this.editarAberto = true;
  }

  fecharEditar() {
    this.editarAberto = false;
    this.utilizadorEdicao = null;
    this.editForm = null;
  }

  guardarEdicao() {
    if (this.editForm.valid) {
      const isRegistado = this.utilizadorEdicao.perfil === 1;
      const dados: any = {
        id: this.utilizadorEdicao.id,
        numeroUtente: this.utilizadorEdicao.numeroUtente || '',
        nomeCompleto: this.editForm.value.nomeCompleto,
        dataNascimento: this.editForm.value.dataNascimento,
        genero: this.editForm.value.genero,
        telemovel: this.editForm.value.telemovel,
        email: this.editForm.value.email,
        morada: this.editForm.value.morada,
        fotoPath: this.utilizadorEdicao.fotoPath || '',
        perfil: this.utilizadorEdicao.perfil
      };
      if (isRegistado) {
        dados.passwordHash = this.utilizadorEdicao.passwordHash || '';
      }
      this.usersService.updateUser(dados.id, dados).subscribe({
        next: (res: any) => {
          alert('Utilizador atualizado com sucesso!');
          this.fecharEditar();
          this.carregarUsuarios(); // Recarregar dados da API
        },
        error: (err: any) => {
          console.error('Erro ao atualizar utilizador:', err);
          alert('Erro ao atualizar utilizador. Tente novamente.');
        }
      });
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
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
    if (confirm(`Eliminar utilizador ${usuario.nome || usuario.nomeCompleto}? Esta ação não pode ser desfeita.`)) {
      this.usersService.eliminarUser(usuario.id).subscribe({
        next: () => {
          alert('Utilizador eliminado com sucesso!');
          this.carregarUsuarios();
        },
        error: (err) => {
          console.error('Erro ao eliminar utilizador:', err);
          alert('Erro ao eliminar utilizador. Tente novamente.');
        }
      });
    }
  }

  ativarUsuario(usuario: any) {
    if (!confirm(`Deseja ativar o utilizador ${usuario.nome || usuario.nomeCompleto}?`)) return;
    const dadosPromocao = {
      nomeCompleto: usuario.nomeCompleto,
      email: usuario.email,
      telemovel: usuario.telemovel,
      password: usuario.password || '',
      dataNascimento: usuario.dataNascimento,
      morada: usuario.morada
    };
    this.usersService.promoverUser(usuario.id, dadosPromocao).subscribe({
      next: () => {
        alert('Utilizador promovido a registado com sucesso!');
        this.carregarUsuarios();
      },
      error: (err) => {
        console.error('Erro ao ativar utilizador:', err);
        alert('Erro ao ativar utilizador. Tente novamente.');
      }
    });
  }

  gerarFotoUrl(usuario: any): string {
    const foto = usuario.fotoPath || usuario.foto;
    if (foto) {
      let url = foto;
      if (url.startsWith('http://')) {
        url = url.replace('http://', 'https://');
      }
      return url; // sem timestamp!
    }
    return '/assets/default-avatar.png';
  }

  getPerfilKey(perfil: number): string {
    const keys: { [key: number]: string } = {
      0: 'anonimo',
      1: 'registado',
      2: 'administrativo',
      3: 'admin'
    };
    return keys[perfil] || 'desconhecido';
  }

  getStatusKey(perfil: number): string {
    // Apenas utilizadores registados (perfil 1) são ativos, todos os outros são inativos
    if (perfil === 1) return 'ativo';
    return 'inativo';
  }
} 