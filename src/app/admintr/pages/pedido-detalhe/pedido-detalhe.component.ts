import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, ActivatedRoute, Router } from "@angular/router"
import { PedidosService } from "../../../core/services/pedidos.service"
import { FormGroup } from "@angular/forms"
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: "app-pedido-detalhe",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="pedido-detalhe-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <button class="back-btn" (click)="voltar()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Voltar
          </button>
          <div class="header-content">
            <h1 class="page-title">Detalhe do Pedido #{{ pedido?.id }}</h1>
            <p class="page-subtitle">{{ getTipoConsulta(pedido) }}</p>
          </div>
        </div>
        <div class="header-right">
          <button class="export-btn" (click)="exportarPDF()">
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

      <div class="content-grid">
        <!-- Informações do Pedido -->
        <div class="info-section">
          <h2>Informações do Pedido</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">ID do Pedido:</span>
              <span class="info-value">#{{ pedido?.id }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Tipo de Consulta:</span>
              <span class="info-value">{{ getTipoConsulta(pedido) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Estado:</span>
              <span class="status-badge" [class]="'status-' + getStatusClass(pedido?.estado)">
                {{ getStatusLabel(pedido?.estado) }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">Tipo de Utente:</span>
              <span class="tipo-badge" [class]="'tipo-' + getTipoUtente(pedido)">
                {{ getTipoUtente(pedido) }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">Data Preferida:</span>
              <span class="info-value">{{ pedido?.dataInicioPreferida | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Horário Preferido:</span>
              <span class="info-value">{{ pedido?.horarioPreferido }}</span>
            </div>
          </div>
        </div>

        <!-- Dados do Utente -->
        <div class="info-section">
          <h2>Dados do Utente</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Nome:</span>
              <span class="info-value">{{ pedido?.user?.nomeCompleto || 'Utente Anónimo' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email:</span>
              <span class="info-value">{{ pedido?.user?.email || 'Não informado' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Telefone:</span>
              <span class="info-value">{{ pedido?.user?.telemovel || 'Não informado' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Data de Nascimento:</span>
              <span class="info-value">{{ pedido?.user?.dataNascimento | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Número de Utente:</span>
              <span class="info-value">{{ pedido?.user?.numeroUtente || 'Não informado' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Endereço:</span>
              <span class="info-value">{{ pedido?.user?.morada || 'Não informado' }}</span>
            </div>
          </div>
        </div>

        <!-- Detalhes da Consulta -->
        <div class="info-section">
          <h2>Detalhes da Consulta</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Data Preferida:</span>
              <span class="info-value">{{ pedido?.dataInicioPreferida | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Data Fim Preferida:</span>
              <span class="info-value">{{ pedido?.dataFimPreferida | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Horário Preferido:</span>
              <span class="info-value">{{ pedido?.horarioPreferido }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Subsistema:</span>
              <span class="info-value">{{ getSubsistema(pedido) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Profissional:</span>
              <span class="info-value">{{ getProfissional(pedido) || 'A definir' }}</span>
            </div>
            <div class="info-item full-width">
              <span class="info-label">Observações:</span>
              <span class="info-value">{{ pedido?.observacoes || 'Nenhuma observação' }}</span>
            </div>
          </div>
        </div>

        <!-- Atos Clínicos -->
        <div class="info-section">
          <h2>Atos Clínicos Associados</h2>
          <div class="atos-clinicos" *ngIf="pedido?.actosClinicos && pedido.actosClinicos.length > 0; else noAtos">
            <div *ngFor="let ato of pedido.actosClinicos" class="ato-item">
              <div class="ato-header">
                <h4>{{ ato.tipo }}</h4>
                <span class="ato-subsistema">{{ ato.subsistemaSaude }}</span>
              </div>
              <div class="ato-content">
                <p><strong>Subsistema:</strong> {{ ato.subsistemaSaude }}</p>
                <p *ngIf="ato.profissional"><strong>Profissional:</strong> {{ ato.profissional }}</p>
              </div>
            </div>
          </div>
          <ng-template #noAtos>
            <div class="no-atos">
              <p>Nenhum ato clínico associado a este pedido.</p>
            </div>
          </ng-template>
        </div>
      </div>

      <!-- Ações -->
      <div class="actions-section">
        <div class="actions-grid">
          <button *ngIf="pedido?.estado === 0" class="action-btn success" (click)="agendarPedido()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            Agendar Consulta
          </button>
          <button *ngIf="pedido?.estado === 1" class="action-btn completed" (click)="realizarPedido()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
            Realizar Consulta
          </button>
          <button *ngIf="pedido?.tipo === 'Anónimo' && pedido?.estado === 'Agendado'" class="action-btn promote" (click)="promoverUtente()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
            Promover para Utente Registado
          </button>
          <button class="action-btn secondary" (click)="abrirEditarPedido()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/>
            </svg>
            Editar Pedido
          </button>
        </div>
      </div>

      <!-- Modal de Edição do Pedido -->
      <div class="modal-overlay" *ngIf="editarAberto">
        <div class="modal-content">
          <h2>Editar Pedido</h2>
          <form *ngIf="editForm" [formGroup]="editForm" (ngSubmit)="salvarEdicao()">
            <div class="form-group">
              <label>Data Início Preferida:</label>
              <input type="date" formControlName="dataInicioPreferida" />
            </div>
            <div class="form-group">
              <label>Data Fim Preferida:</label>
              <input type="date" formControlName="dataFimPreferida" />
            </div>
            <div class="form-group">
              <label>Hora Início Preferida:</label>
              <select formControlName="horaInicioPreferida">
                <option value="">Selecione um horário</option>
                <option value="09:00">09:00</option>
                <option value="09:30">09:30</option>
                <option value="10:00">10:00</option>
                <option value="10:30">10:30</option>
                <option value="11:00">11:00</option>
                <option value="11:30">11:30</option>
                <option value="14:00">14:00</option>
                <option value="14:30">14:30</option>
                <option value="15:00">15:00</option>
                <option value="15:30">15:30</option>
                <option value="16:00">16:00</option>
                <option value="16:30">16:30</option>
              </select>
            </div>
            <div class="form-group">
              <label>Hora Fim Preferida:</label>
              <select formControlName="horaFimPreferida">
                <option value="">Selecione um horário</option>
                <option value="09:00">09:00</option>
                <option value="09:30">09:30</option>
                <option value="10:00">10:00</option>
                <option value="10:30">10:30</option>
                <option value="11:00">11:00</option>
                <option value="11:30">11:30</option>
                <option value="14:00">14:00</option>
                <option value="14:30">14:30</option>
                <option value="15:00">15:00</option>
                <option value="15:30">15:30</option>
                <option value="16:00">16:00</option>
                <option value="16:30">16:30</option>
              </select>
            </div>
            <div class="form-group">
              <label>Subsistema:</label>
              <input type="text" formControlName="subsistema" />
            </div>
            <div class="form-group">
              <label>Profissional:</label>
              <input type="text" formControlName="profissional" />
            </div>
            <div class="form-group">
              <label>Observações:</label>
              <textarea formControlName="observacoes"></textarea>
            </div>
            <div class="modal-actions">
              <button type="submit" class="action-btn success">Salvar</button>
              <button type="button" class="action-btn danger" (click)="fecharEditarPedido()">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pedido-detalhe-container {
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

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .back-btn {
      background: transparent;
      color: #00548d;
      border: 1px solid #00548d;
      padding: 0.5rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .back-btn:hover {
      background: #00548d;
      color: white;
    }

    .back-btn svg {
      width: 20px;
      height: 20px;
    }

    .header-content {
      display: flex;
      flex-direction: column;
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

    .export-btn:hover {
      background: #b91c1c;
    }

    .export-btn svg {
      width: 20px;
      height: 20px;
    }

    .content-grid {
      display: grid;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .info-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .info-section h2 {
      font-size: 1.3rem;
      font-weight: 600;
      color: #00548d;
      margin: 0 0 1.5rem 0;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .info-item.full-width {
      grid-column: 1 / -1;
    }

    .info-label {
      font-weight: 600;
      color: #666;
      font-size: 0.9rem;
    }

    .info-value {
      color: #333;
      font-size: 1rem;
    }

    .status-badge, .tipo-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      display: inline-block;
      width: fit-content;
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

    .tipo-anonimo {
      background: #fef3c7;
      color: #92400e;
    }

    .tipo-registado {
      background: #dbeafe;
      color: #1e40af;
    }

    .atos-clinicos {
      display: grid;
      gap: 1rem;
    }

    .ato-item {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1rem;
    }

    .ato-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .ato-header h4 {
      margin: 0;
      color: #333;
    }

    .ato-date {
      font-size: 0.9rem;
      color: #666;
    }

    .ato-content p {
      margin: 0.5rem 0;
      color: #666;
    }

    .no-atos {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .historico {
      display: grid;
      gap: 1rem;
    }

    .alteracao-item {
      border-left: 3px solid #00548d;
      padding-left: 1rem;
    }

    .alteracao-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .alteracao-date {
      font-size: 0.9rem;
      color: #666;
    }

    .alteracao-user {
      font-weight: 600;
      color: #00548d;
    }

    .alteracao-content p {
      margin: 0.25rem 0;
      color: #666;
    }

    .actions-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .actions-grid {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .action-btn {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
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
      background: transparent;
      color: #00548d;
      border: 1px solid #00548d;
    }

    .action-btn.secondary:hover {
      background: #00548d;
      color: white;
    }

    .action-btn svg {
      width: 20px;
      height: 20px;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      width: 90%;
      max-width: 600px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      position: relative;
    }

    .modal-content h2 {
      font-size: 1.8rem;
      font-weight: 700;
      color: #00548d;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      font-weight: 600;
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .form-group input[type="date"],
    .form-group input[type="text"],
    .form-group textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      font-size: 1rem;
      color: #333;
      transition: border-color 0.2s;
    }

    .form-group input[type="date"]:focus,
    .form-group input[type="text"]:focus,
    .form-group textarea:focus {
      border-color: #00548d;
      outline: none;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    .action-btn.danger {
      background: #ef4444;
      color: white;
    }

    .action-btn.danger:hover {
      background: #dc2626;
    }

    @media (max-width: 768px) {
      .pedido-detalhe-container {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .header-left {
        flex-direction: column;
        gap: 1rem;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        flex-direction: column;
      }

      .action-btn {
        justify-content: center;
      }
    }
  `]
})
export class PedidoDetalheComponent implements OnInit {
  pedido: any = null;
  atosClinicos: any[] = [];
  historico: any[] = [];
  editarAberto: boolean = false;
  editForm: FormGroup | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pedidosService: PedidosService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
    if (id) {
        this.carregarPedido(id);
    }
    });
  }

  carregarPedido(id: number) {
    this.pedidosService.getById(id).subscribe({
      next: (pedido) => {
        this.pedido = pedido;
      },
      error: (error) => {
        console.error('Erro ao carregar pedido:', error);
      }
    });
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
      0: 'pendente',
      1: 'agendado',
      2: 'realizado',
      3: 'cancelado'
    };
    return classes[estado] || 'unknown';
  }

  getTipoConsulta(pedido: any): string {
    if (pedido?.actosClinicos && pedido.actosClinicos.length > 0) {
      return pedido.actosClinicos[0].tipo || 'Consulta';
    }
    return 'Consulta';
  }

  getTipoUtente(pedido: any): string {
    if (pedido?.user?.perfil === 0) {
      return 'Anónimo';
    } else if (pedido?.user?.perfil === 1) {
      return 'Registado';
    }
    return 'Desconhecido';
  }

  getSubsistema(pedido: any): string {
    if (pedido?.actosClinicos && pedido.actosClinicos.length > 0) {
      return pedido.actosClinicos[0].subsistemaSaude || '';
    }
    return '';
  }

  getProfissional(pedido: any): string {
    if (pedido?.actosClinicos && pedido.actosClinicos.length > 0) {
      return pedido.actosClinicos[0].profissional || '';
    }
    return '';
  }

  voltar() {
    this.router.navigate(['/admintr/pedidos']);
  }

  exportarPDF() {
    if (!this.pedido?.id) return;
    
    this.pedidosService.exportarPdf(this.pedido.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      },
      error: (error) => {
        alert('Erro ao exportar PDF da marcação!');
        console.error(error);
      }
    });
  }

  agendarPedido() {
    if (!this.pedido?.id) return;

    const nomeUtente = this.pedido.user?.nomeCompleto || 'Utente';
    if (confirm(`Confirmar agendamento para ${nomeUtente}?`)) {
      // Usa a dataInicioPreferida como data agendada, garantindo o formato correto
      let dataAgendada = this.pedido.dataInicioPreferida;
      // Se vier só a data, adiciona hora padrão
      if (dataAgendada && dataAgendada.length === 10) {
        dataAgendada = dataAgendada + 'T09:00:00';
      }
      // Se não houver data, usa o momento atual
      if (!dataAgendada) {
        dataAgendada = new Date().toISOString().slice(0, 19);
      }
      this.pedidosService.agendar(this.pedido.id, dataAgendada).subscribe({
        next: () => {
          console.log('Pedido agendado com sucesso');
          this.carregarPedido(this.pedido.id);
        },
        error: (error) => {
          console.error('Erro ao agendar pedido:', error);
        }
      });
    }
  }

  realizarPedido() {
    if (!this.pedido?.id) return;
    
    const nomeUtente = this.pedido.user?.nomeCompleto || 'Utente';
    if (confirm(`Confirmar realização da consulta para ${nomeUtente}?`)) {
      this.pedidosService.realizar(this.pedido.id).subscribe({
        next: () => {
          console.log('Pedido marcado como realizado');
          this.carregarPedido(this.pedido.id);
        },
        error: (error) => {
          console.error('Erro ao marcar pedido como realizado:', error);
        }
      });
    }
  }

  promoverUtente() {
    if (confirm('Promover este utente anónimo para registado?')) {
      console.log('Promover utente:', this.pedido?.id);
      // Implementar promoção
      alert('Utente promovido com sucesso! Email com credenciais enviado.');
    }
  }

  abrirEditarPedido() {
    this.editarAberto = true;
    this.editForm = this.pedidosService.getEditForm(this.pedido);
  }

  fecharEditarPedido() {
    this.editarAberto = false;
    this.editForm?.reset();
  }

  salvarEdicao() {
    if (this.editForm && this.editForm.valid) {
      const formValue = this.editForm.value;
      const payload = {
        ...formValue,
        horarioPreferido: formValue.horaInicioPreferida && formValue.horaFimPreferida ? `${formValue.horaInicioPreferida} - ${formValue.horaFimPreferida}` : '',
      };
      this.pedidosService.update(this.pedido.id, payload).subscribe({
        next: () => {
          console.log('Pedido editado com sucesso');
          this.carregarPedido(this.pedido.id);
          this.fecharEditarPedido();
        },
        error: (error) => {
          console.error('Erro ao editar pedido:', error);
          alert('Erro ao salvar edição do pedido.');
        }
      });
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  editarPedido() {
    console.log('Editar pedido:', this.pedido?.id);
    // Implementar edição
    alert('Funcionalidade de edição em desenvolvimento.');
  }
} 