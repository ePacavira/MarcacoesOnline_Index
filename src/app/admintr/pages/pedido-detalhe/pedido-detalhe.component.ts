import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, ActivatedRoute, Router } from "@angular/router"

@Component({
  selector: "app-pedido-detalhe",
  standalone: true,
  imports: [CommonModule, RouterModule],
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
            <p class="page-subtitle">{{ pedido?.tipoConsulta }}</p>
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
              <span class="info-value">{{ pedido?.tipoConsulta }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Estado:</span>
              <span class="status-badge" [class]="'status-' + pedido?.estado?.toLowerCase()">
                {{ getStatusLabel(pedido?.estado) }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">Tipo de Utente:</span>
              <span class="tipo-badge" [class]="'tipo-' + pedido?.tipo?.toLowerCase()">
                {{ pedido?.tipo }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">Data de Criação:</span>
              <span class="info-value">{{ pedido?.dataCriacao | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Última Atualização:</span>
              <span class="info-value">{{ pedido?.dataAtualizacao | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
          </div>
        </div>

        <!-- Dados do Utente -->
        <div class="info-section">
          <h2>Dados do Utente</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Nome:</span>
              <span class="info-value">{{ pedido?.nomeUtente }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email:</span>
              <span class="info-value">{{ pedido?.email }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Telefone:</span>
              <span class="info-value">{{ pedido?.telefone }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Data de Nascimento:</span>
              <span class="info-value">{{ pedido?.dataNascimento | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">NIF:</span>
              <span class="info-value">{{ pedido?.nif || 'Não informado' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Endereço:</span>
              <span class="info-value">{{ pedido?.endereco || 'Não informado' }}</span>
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
              <span class="info-label">Horário Preferido:</span>
              <span class="info-value">{{ pedido?.horarioPreferido }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Local:</span>
              <span class="info-value">{{ pedido?.local }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Médico:</span>
              <span class="info-value">{{ pedido?.medico || 'A definir' }}</span>
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
          <div class="atos-clinicos" *ngIf="atosClinicos.length > 0; else noAtos">
            <div *ngFor="let ato of atosClinicos" class="ato-item">
              <div class="ato-header">
                <h4>{{ ato.tipo }}</h4>
                <span class="ato-date">{{ ato.data | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <div class="ato-content">
                <p><strong>Descrição:</strong> {{ ato.descricao }}</p>
                <p><strong>Médico:</strong> {{ ato.medico }}</p>
                <p><strong>Resultados:</strong> {{ ato.resultados }}</p>
              </div>
            </div>
          </div>
          <ng-template #noAtos>
            <div class="no-atos">
              <p>Nenhum ato clínico associado a este pedido.</p>
            </div>
          </ng-template>
        </div>

        <!-- Histórico de Alterações -->
        <div class="info-section">
          <h2>Histórico de Alterações</h2>
          <div class="historico">
            <div *ngFor="let alteracao of historico" class="alteracao-item">
              <div class="alteracao-header">
                <span class="alteracao-date">{{ alteracao.data | date:'dd/MM/yyyy HH:mm' }}</span>
                <span class="alteracao-user">{{ alteracao.usuario }}</span>
              </div>
              <div class="alteracao-content">
                <p><strong>Ação:</strong> {{ alteracao.acao }}</p>
                <p *ngIf="alteracao.detalhes"><strong>Detalhes:</strong> {{ alteracao.detalhes }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ações -->
      <div class="actions-section">
        <div class="actions-grid">
          <button 
            *ngIf="pedido?.estado === 'Pedido'" 
            class="action-btn success" 
            (click)="agendarPedido()"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            Agendar Consulta
          </button>
          
          <button 
            *ngIf="pedido?.estado === 'Agendado'" 
            class="action-btn completed" 
            (click)="realizarPedido()"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
            Realizar Consulta
          </button>
          
          <button 
            *ngIf="pedido?.tipo === 'Anónimo' && pedido?.estado === 'Agendado'" 
            class="action-btn promote" 
            (click)="promoverUtente()"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
            Promover para Utente Registado
          </button>
          
          <button class="action-btn secondary" (click)="editarPedido()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Editar Pedido
          </button>
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

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarPedido(parseInt(id));
    }
  }

  carregarPedido(id: number) {
    // Mock data - em produção viria do serviço
    this.pedido = {
      id: id,
      tipoConsulta: 'Consulta Geral',
      nomeUtente: 'João Silva',
      email: 'joao.silva@email.com',
      telefone: '+351 123 456 789',
      dataNascimento: new Date('1985-03-15'),
      nif: '123456789',
      endereco: 'Rua das Flores, 123, 1000-001 Lisboa',
      dataInicioPreferida: new Date('2024-01-15 10:00'),
      horarioPreferido: '10:00',
      local: 'Clínica Medi - Lisboa',
      medico: 'Dr. Carlos Oliveira',
      estado: 'Agendado',
      tipo: 'Registado',
      observacoes: 'Trazer exames recentes',
      dataCriacao: new Date('2024-01-10 14:30'),
      dataAtualizacao: new Date('2024-01-12 09:15')
    };

    this.carregarAtosClinicos(id);
    this.carregarHistorico(id);
  }

  carregarAtosClinicos(pedidoId: number) {
    // Mock data
    this.atosClinicos = [
      {
        tipo: 'Consulta Geral',
        data: new Date('2024-01-15 10:00'),
        descricao: 'Consulta de rotina com avaliação geral',
        medico: 'Dr. Carlos Oliveira',
        resultados: 'Paciente em bom estado geral'
      },
      {
        tipo: 'Exame de Sangue',
        data: new Date('2024-01-16 08:00'),
        descricao: 'Análises sanguíneas de rotina',
        medico: 'Dra. Ana Costa',
        resultados: 'Valores dentro dos parâmetros normais'
      }
    ];
  }

  carregarHistorico(pedidoId: number) {
    // Mock data
    this.historico = [
      {
        data: new Date('2024-01-12 09:15'),
        usuario: 'Dr. Carlos Oliveira',
        acao: 'Pedido agendado',
        detalhes: 'Consulta marcada para 15/01/2024 às 10:00'
      },
      {
        data: new Date('2024-01-10 14:30'),
        usuario: 'Sistema',
        acao: 'Pedido criado',
        detalhes: 'Pedido de marcação recebido'
      }
    ];
  }

  getStatusLabel(estado: string): string {
    const labels: { [key: string]: string } = {
      'Pedido': 'Pedido',
      'Agendado': 'Agendado',
      'Realizado': 'Realizado'
    };
    return labels[estado] || estado;
  }

  voltar() {
    this.router.navigate(['/admintr/pedidos']);
  }

  exportarPDF() {
    console.log('Exportar PDF do pedido:', this.pedido?.id);
    // Implementar exportação PDF
    alert('PDF exportado com sucesso!');
  }

  agendarPedido() {
    if (confirm('Confirmar agendamento desta consulta?')) {
      console.log('Agendar pedido:', this.pedido?.id);
      // Implementar agendamento
      alert('Pedido agendado com sucesso!');
    }
  }

  realizarPedido() {
    if (confirm('Confirmar realização desta consulta?')) {
      console.log('Realizar pedido:', this.pedido?.id);
      // Implementar realização
      alert('Consulta realizada com sucesso!');
    }
  }

  promoverUtente() {
    if (confirm('Promover este utente anónimo para registado?')) {
      console.log('Promover utente:', this.pedido?.id);
      // Implementar promoção
      alert('Utente promovido com sucesso! Email com credenciais enviado.');
    }
  }

  editarPedido() {
    console.log('Editar pedido:', this.pedido?.id);
    // Implementar edição
    alert('Funcionalidade de edição em desenvolvimento.');
  }
} 