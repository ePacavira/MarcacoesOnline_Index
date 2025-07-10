import { Component, type OnInit, signal } from "@angular/core"
import { CommonModule } from "@angular/common"

interface DashboardStats {
  totalPatients: number
  todayAppointments: number
  monthlyRevenue: number
  pendingAppointments: number
}

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-3xl font-bold text-gray-800">Dashboard</h2>
        <div class="text-sm text-gray-600">
          Última atualização: {{ lastUpdate | date:'dd/MM/yyyy HH:mm' }}
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total de Utentes</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats().totalPatients }}</p>
            </div>
            <div class="text-blue-600 text-3xl">👥</div>
          </div>
          <div class="mt-4">
            <span class="text-green-600 text-sm">+12% este mês</span>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Marcações de Hoje</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats().todayAppointments }}</p>
            </div>
           <div class="text-green-600 text-3xl">📅✍️</div>
          </div>
          <div class="mt-4">
            <span class="text-blue-600 text-sm">{{ stats().pendingAppointments }} pendentes</span>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total de Marcacões</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats().monthlyRevenue.toLocaleString() }}</p>
            </div>
          <div class="text-green-600 text-3xl">🩺📅</div>
          </div>
          <div class="mt-4">
            <span class="text-green-600 text-sm">+8% vs mês anterior</span>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Taxa de pedidos no mês</p>
              <p class="text-3xl font-bold text-gray-900">85%</p>
            </div>
            <div class="text-purple-600 text-3xl">📊</div>
          </div>
          <div class="mt-4">
            <span class="text-green-600 text-sm">Ótima performance</span>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold mb-4">Próximas Consultas</h3>
          <div class="space-y-3">
            @for (appointment of upcomingAppointments(); track appointment.id) {
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p class="font-medium">{{ appointment.patientName }}</p>
                  <p class="text-sm text-gray-600">{{ appointment.service }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium">{{ appointment.time }}</p>
                  <p class="text-xs text-gray-500">{{ appointment.doctor }}</p>
                </div>
              </div>
            }
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold mb-4">Atividades Recentes</h3>
          <div class="space-y-3">
            @for (activity of recentActivities(); track activity.id) {
              <div class="flex items-start space-x-3">
                <div class="text-lg">{{ activity.icon }}</div>
                <div class="flex-1">
                  <p class="text-sm">{{ activity.description }}</p>
                  <p class="text-xs text-gray-500">{{ activity.time }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-4">Ações Rápidas</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button class="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
            <div class="text-2xl mb-2">➕</div>
            <p class="text-sm font-medium">Nova Consulta</p>
          </button>
          <button class="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
            <div class="text-2xl mb-2">👤</div>
            <p class="text-sm font-medium">Novo Paciente</p>
          </button>
          <button class="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-center transition-colors">
            <div class="text-2xl mb-2">📋</div>
            <p class="text-sm font-medium">Relatório</p>
          </button>
          <button class="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
            <div class="text-2xl mb-2">⚙️</div>
            <p class="text-sm font-medium">Configurações</p>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  stats = signal<DashboardStats>({
    totalPatients: 0,
    todayAppointments: 0,
    monthlyRevenue: 0,
    pendingAppointments: 0,
  })

  upcomingAppointments = signal([
    { id: 1, patientName: "João Silva", service: "Clínica Geral", time: "09:00", doctor: "Dr. Maria" },
    { id: 2, patientName: "Ana Costa", service: "Cardiologia", time: "10:30", doctor: "Dr. Pedro" },
    { id: 3, patientName: "Carlos Santos", service: "Dermatologia", time: "14:00", doctor: "Dra. Ana" },
  ])

  recentActivities = signal([
    { id: 1, icon: "✅", description: "Consulta confirmada para João Silva", time: "5 min atrás" },
    { id: 2, icon: "📝", description: "Novo paciente cadastrado: Maria Oliveira", time: "15 min atrás" },
    { id: 3, icon: "💰", description: "Pagamento recebido de R$ 200,00", time: "1 hora atrás" },
    { id: 4, icon: "📞", description: "Ligação perdida de (11) 99999-9999", time: "2 horas atrás" },
  ])

  lastUpdate = new Date()

  ngOnInit(): void {
    this.loadDashboardData()
  }

  private loadDashboardData(): void {
    // Simulando dados - em produção viria da API
    setTimeout(() => {
      this.stats.set({
        totalPatients: 1247,
        todayAppointments: 18,
        monthlyRevenue: 200,
        pendingAppointments: 5,
      })
    }, 1000)
  }
}
