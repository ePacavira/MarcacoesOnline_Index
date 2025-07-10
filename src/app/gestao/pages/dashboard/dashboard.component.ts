import { Component, type OnInit, signal } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="header-left">
          <h1 class="dashboard-title">Dashboard</h1>
          <p class="dashboard-subtitle">Bem-vindo ao painel de gestão</p>
        </div>
        <div class="header-right">
          <div class="date-info">
            <span class="current-date">{{ currentDate }}</span>
          </div>
        </div>
      </div>

      <!-- Cards de Estatísticas -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">1,234</h3>
            <p class="stat-label">Total de Marcações</p>
            <span class="stat-change positive">+12% este mês</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">856</h3>
            <p class="stat-label">Pacientes Ativos</p>
            <span class="stat-change positive">+8% este mês</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">92%</h3>
            <p class="stat-label">Taxa de Satisfação</p>
            <span class="stat-change positive">+3% este mês</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">15min</h3>
            <p class="stat-label">Tempo Médio de Espera</p>
            <span class="stat-change negative">-5% este mês</span>
          </div>
        </div>
      </div>

      <!-- Conteúdo Principal -->
      <div class="dashboard-content">
        <!-- Gráfico Principal -->
        <div class="chart-section">
          <div class="chart-header">
            <h2>Marcações por Mês</h2>
            <div class="chart-actions">
              <button class="chart-btn active">7 dias</button>
              <button class="chart-btn">30 dias</button>
              <button class="chart-btn">90 dias</button>
            </div>
          </div>
          <div class="chart-container">
            <div class="chart-placeholder">
              <div class="chart-bars">
                <div class="bar" style="height: 60%"></div>
                <div class="bar" style="height: 80%"></div>
                <div class="bar" style="height: 45%"></div>
                <div class="bar" style="height: 90%"></div>
                <div class="bar" style="height: 70%"></div>
                <div class="bar" style="height: 85%"></div>
                <div class="bar" style="height: 75%"></div>
              </div>
              <div class="chart-labels">
                <span>Seg</span>
                <span>Ter</span>
                <span>Qua</span>
                <span>Qui</span>
                <span>Sex</span>
                <span>Sáb</span>
                <span>Dom</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabela de Atividades Recentes -->
        <div class="recent-section">
          <div class="section-header">
            <h2>Atividades Recentes</h2>
            <button class="view-all-btn">Ver Todas</button>
          </div>
          <div class="activity-list">
            <div class="activity-item">
              <div class="activity-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                </svg>
              </div>
              <div class="activity-content">
                <p class="activity-text">Nova marcação criada por <strong>João Silva</strong></p>
                <span class="activity-time">há 5 minutos</span>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"/>
                  <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"/>
                </svg>
              </div>
              <div class="activity-content">
                <p class="activity-text">Consulta confirmada para <strong>Maria Santos</strong></p>
                <span class="activity-time">há 15 minutos</span>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                </svg>
              </div>
              <div class="activity-content">
                <p class="activity-text">Novo paciente registado: <strong>Ana Costa</strong></p>
                <span class="activity-time">há 1 hora</span>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <div class="activity-content">
                <p class="activity-text">Marcação cancelada por <strong>Pedro Lima</strong></p>
                <span class="activity-time">há 2 horas</span>
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
      color: #666;
      margin: 0.5rem 0 0 0;
    }

    .current-date {
      color: #00548d;
      font-weight: 500;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,84,141,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
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
    }

    .stat-icon svg {
      width: 24px;
      height: 24px;
    }

    .stat-content {
      flex: 1;
    }

    .stat-number {
      font-size: 1.8rem;
      font-weight: 700;
      color: #00548d;
      margin: 0;
    }

    .stat-label {
      color: #666;
      margin: 0.25rem 0;
    }

    .stat-change {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .stat-change.positive {
      color: #10b981;
    }

    .stat-change.negative {
      color: #ef4444;
    }

    .dashboard-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }

    .chart-section, .recent-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,84,141,0.1);
    }

    .chart-header, .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .chart-header h2, .section-header h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #00548d;
      margin: 0;
    }

    .chart-actions {
      display: flex;
      gap: 0.5rem;
    }

    .chart-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 6px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .chart-btn.active, .chart-btn:hover {
      background: #00548d;
      color: white;
      border-color: #00548d;
    }

    .chart-container {
      height: 300px;
      display: flex;
      align-items: end;
      justify-content: center;
      padding: 1rem 0;
    }

    .chart-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    }

    .chart-bars {
      display: flex;
      align-items: end;
      gap: 1rem;
      height: 200px;
    }

    .bar {
      width: 40px;
      background: linear-gradient(to top, #00548d, #0077cc);
      border-radius: 4px 4px 0 0;
      min-height: 20px;
    }

    .chart-labels {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: #666;
    }

    .view-all-btn {
      padding: 0.5rem 1rem;
      background: #00548d;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .view-all-btn:hover {
      background: #003a5c;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 8px;
      background: #f8fafc;
      transition: background 0.2s;
    }

    .activity-item:hover {
      background: #e6eaf3;
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      background: #00548d;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .activity-icon svg {
      width: 20px;
      height: 20px;
    }

    .activity-content {
      flex: 1;
    }

    .activity-text {
      margin: 0;
      color: #333;
      font-size: 0.875rem;
    }

    .activity-time {
      color: #666;
      font-size: 0.75rem;
    }

    @media (max-width: 1024px) {
      .dashboard-content {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }
  `]
})

export class DashboardComponent implements OnInit {
  currentDate = '';

  ngOnInit() {
    this.currentDate = new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
