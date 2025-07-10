import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { AuthService } from "../../core/services/auth.service"
import { PrivateSidebarComponent } from "../../shared/components/private-sidebar/private-sidebar.component";

@Component({
  selector: "app-gestao-layout",
  standalone: true,
  imports: [CommonModule, RouterModule, PrivateSidebarComponent],
  template: `
    <div class="dashboard-layout bg-gray-100">
      <!-- Sidebar -->
      <app-private-sidebar></app-private-sidebar>
      <!-- Main Content -->
      <main class="dashboard-main overflow-auto">
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
