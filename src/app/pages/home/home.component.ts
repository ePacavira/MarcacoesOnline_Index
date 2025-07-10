import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

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

}
