import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { AuthService } from "../../core/services/auth.service"

@Component({
  selector: "app-gestao-layout",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex h-screen bg-gray-100">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-lg">
        <div class="p-4 border-b">
            <div class="flex shrink-0 gap-3 items-center">
                    <a  routerLink="/" [routerLinkActive]="'active'">
                        <img class="h-12 w-auto" src="/logo.jpg" alt="Your Company">
                    </a>
            <h2 class="text-xl font-bold text-gray-800">Gestão Clínica</h2>
                </div>
          
          <p class="text-sm text-gray-600">{{ currentUser()?.nome}}</p>
        </div>
        
        <nav class="mt-4">
          <ul class="space-y-1">
            <li>
              <a routerLink="/gestao/dashboard" routerLinkActive="bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                 class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                <span class="mr-3">📊</span>
                Dashboard
              </a>
            </li>
            @if (authService.isUtente()) {
              <li>
              <a routerLink="/gestao/marcacoes" routerLinkActive="bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                 class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                <span class="mr-3">📅</span>
                Minhas Marcações
              </a>
            </li>
                 }@else{
            <li>
              <a routerLink="/gestao/marcacoes" routerLinkActive="bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                 class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                <span class="mr-3">📅</span>
                Marcações
              </a>
            </li>
            <li>
              <a routerLink="/gestao/pacientes" routerLinkActive="bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                 class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                <span class="mr-3">👥</span>
                Pacientes
              </a>
            </li>
            <li>
              <a routerLink="/gestao/medicos" routerLinkActive="bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                 class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                <span class="mr-3">👨‍⚕️</span>
                Médicos
              </a>
            </li>
            <li>
              <a routerLink="/gestao/servicos" routerLinkActive="bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                 class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                <span class="mr-3">🏥</span>
                Serviços
              </a>
            </li>
            <li>
              <a routerLink="/gestao/relatorios" routerLinkActive="bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                 class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                <span class="mr-3">📈</span>
                Relatórios
              </a>
            </li>
            <li>
              <a routerLink="/gestao/profile" routerLinkActive="bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                 class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                <span class="mr-3">📈</span>
                profile
              </a>
            </li>
            }
          </ul>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto">
        <header class="bg-white shadow-sm border-b px-6 py-4 fixed z-50"   style="width: calc(100% - 16rem)">
          <div class="flex justify-between items-center">
            
            <h1 class="text-2xl font-semibold text-gray-800">Área de Gestão</h1>
            <div class="flex items-center space-x-4">
               <div class="absolute inset-y-0 right-0 gap-4 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button type="button"
                    class="rounded-md cursor-pointer hover:opacity-60 px-3 py-2 text-sm font-medium text-white hover:text-white">
                     <a  routerLink="/login" [routerLinkActive]="'active'" class="text-[#2EB3B0]">
                       KA
                    </a>
                </button>
              

                <!-- Profile dropdown -->

            </div>
              <button class="text-gray-600 hover:text-gray-800">
                🔔
              </button>
             
                <button type="button"  (click)="logout()"
                    class="rounded-md bg-[#2EB3B0] cursor-pointer hover:opacity-60 px-3 py-2 text-sm font-medium text-white hover:bg-[#2EB3B0] hover:text-white">
                       Sair agora
                </button>
            </div>
          </div>
        </header>
        
        <div class="p-6">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
})
export class GestaoLayoutComponent {
  authService = inject(AuthService)
  currentUser = this.authService.currentUser

  logout(): void {
    this.authService.logout()
  }

  getInitials(fullName?: string): string {
    if (!fullName) return '';

    const parts = fullName.trim().split(/\s+/); // divide por espaço
    const first = parts[0]?.charAt(0) || '';
    const last = parts[parts.length - 1]?.charAt(0) || '';

    return (first + last).toUpperCase();
  }
}
