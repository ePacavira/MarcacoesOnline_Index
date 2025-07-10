import { Component, inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Marcacao Consultas online';
  emailCompany = 'contacto@marcenter.co.ao'
  reception = 'recepcao.cq@marcenter.co.ao'
  isUserMenuOpen = false;
  authService = inject(AuthService)
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
}
