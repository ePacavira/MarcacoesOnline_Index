import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

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
    return this.currentUser?.tipoUsuario === 'utente';
  }

  isAdmin(): boolean {
    return this.currentUser?.tipoUsuario === 'admin';
  }

  isSuperAdmin(): boolean {
    return this.currentUser?.tipoUsuario === 'admin' && this.currentUser?.perfil === 'Super Administrador';
  }

  isAdministrativo(): boolean {
    return this.currentUser?.perfil === 'Administrativo';
  }

  getRoleLabel(tipoUsuario: string): string {
    const labels: { [key: string]: string } = {
      'utente': 'Utente',
      'admin': 'Administrador',
      'medico': 'Médico'
    };
    return labels[tipoUsuario] || 'Utilizador';
  }

  logout() {
    this.authService.logout();
  }
}
