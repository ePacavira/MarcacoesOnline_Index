import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-private-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './private-sidebar.component.html',
  styleUrl: './private-sidebar.component.css'
})
export class PrivateSidebarComponent {
   isUserMenuOpen = false;
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
}
