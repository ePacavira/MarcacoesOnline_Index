import { Component } from '@angular/core';

@Component({
  selector: 'app-private-header',
  imports: [],
  templateUrl: './private-header.component.html',
  styleUrl: './private-header.component.css'
})
export class PrivateHeaderComponent {
isUserMenuOpen = false;

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
}
