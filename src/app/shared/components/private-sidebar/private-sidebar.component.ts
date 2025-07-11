import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { UserRoleLabels } from '../../../core/models/user.model';

@Component({
  selector: 'app-private-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './private-sidebar.component.html',
  styleUrl: './private-sidebar.component.css'
})
export class PrivateSidebarComponent {
  isUserMenuOpen = false;
  currentUser: any = null;

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  isUtente(): boolean {
    return this.authService.isUtente();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }

  isAdministrativo(): boolean {
    return this.authService.isAdministrativo();
  }

  getRoleLabel(): string {
    if (this.currentUser?.perfil !== undefined) {
      return UserRoleLabels[this.currentUser.perfil as keyof typeof UserRoleLabels] || 'Utilizador';
    }
    return 'Utilizador';
  }

  logout() {
    this.authService.logout();
  }
}
