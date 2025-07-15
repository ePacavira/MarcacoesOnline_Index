import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = 'Marcacao Consultas online';
  emailCompany= 'contacto@marcenter.co.ao'
  reception='recepcao.cq@marcenter.co.ao'

  constructor(private authService: AuthService, private router: Router) {}

  pedirMarcacao() {
    const user = this.authService.getCurrentUser();
    if (user && user.perfil === 1) {
      this.router.navigate(['/marcacoes']);
    } else {
      this.router.navigate(['/marcacao-anonima']);
    }
  }
}
