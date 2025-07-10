import { RouterModule } from "@angular/router";
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

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
        <!-- Botão Login à direita -->
        <div class="navbar-actions">
          <a routerLink="/login" class="navbar-login">Login</a>
        </div>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {}
