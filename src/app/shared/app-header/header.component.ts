import { RouterModule } from "@angular/router";
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="main-navbar custom-navbar">
      <div class="navbar-container">
        <!-- Logo -->
        <a routerLink="/" class="navbar-logo">
          <img src="/logo.jpg" alt="Logo" />
        </a>
        <!-- Menu centralizado -->
        <ul class="navbar-menu">
          <li><a routerLink="/sobre" routerLinkActive="active">Sobre</a></li>
          <li><a routerLink="/servicos" routerLinkActive="active">Serviços</a></li>
          <li><a routerLink="/contacto" routerLinkActive="active">Contacto</a></li>
        </ul>
        <!-- Botões de ação -->
        <div class="navbar-actions">
          <a routerLink="/consulta-marcacao" class="navbar-btn-secondary">Consultar</a>
          <a routerLink="/marcacao-anonima" class="navbar-btn">Marcar Consulta</a>
          
          <!-- Mostrar área do utente se logado, senão mostrar login -->
          <a *ngIf="!isLoggedIn()" routerLink="/login" class="navbar-login">Login</a>
          <a *ngIf="isLoggedIn()" routerLink="/utente/dashboard" class="navbar-login">Minha Área</a>
        </div>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  constructor(private authService: AuthService) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
