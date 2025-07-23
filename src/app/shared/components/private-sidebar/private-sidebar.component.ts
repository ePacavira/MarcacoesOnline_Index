import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { UserRoleLabels } from '../../../core/models/user.model';
import { Router } from '@angular/router';
import { UserProfileService } from '../../../core/services/user-profile.service';

@Component({
  selector: 'app-private-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './private-sidebar.component.html',
  styleUrl: './private-sidebar.component.css'
})
export class PrivateSidebarComponent {
  isUserMenuOpen = false;
  currentUser: any = null;
  avatarSrc: string = '';

  // Avatar padrão em base64 (imagem simples de 1x1 pixel transparente)
  private readonly DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjMDA1NDhEIi8+CjxwYXRoIGQ9Ik0yMCA4MEMyMCA2NS4zNzIgMzEuMzcyIDU0IDQ2IDU0SDU0QzY4LjYyOCA1NCA4MCA2NS4zNzIgODAgODBWNzBIMjBWODBaIiBmaWxsPSIjMDA1NDhEIi8+Cjwvc3ZnPgo=';

  constructor(private authService: AuthService, private router: Router, private userProfileService: UserProfileService) {
    this.currentUser = this.authService.getCurrentUser();
    this.avatarSrc = this.getFotoPerfilSrc();
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    
    // Se não há foto no servidor, tenta obter do localStorage
    if (this.currentUser && (!this.currentUser.fotoPath || this.currentUser.fotoPath.trim() === '')) {
      const localPhoto = this.userProfileService.getPhotoLocally(this.currentUser.id);
      if (localPhoto) {
        this.currentUser.fotoPath = localPhoto;
        console.log('Foto carregada do localStorage no sidebar');
      }
    }
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

  getFotoPerfilSrc(): string {
    const foto = this.currentUser?.fotoPath;
    
    // Se não há foto definida, usar avatar padrão
    if (!foto || foto.trim() === '') {
      return this.DEFAULT_AVATAR;
    }

      let url = foto;
    
    // Se é uma imagem base64, usar diretamente
    if (url.startsWith('data:image/')) {
      return url;
    }
    
    // Se é uma URL completa, usar diretamente
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url + '?t=' + Date.now();
      }
    
    // Se é um caminho relativo que começa com /, usar como está
    if (url.startsWith('/')) {
      return url + '?t=' + Date.now();
    }
    
    // Se é uma URL do localhost, usar como está
    if (url.includes('localhost')) {
      return url + '?t=' + Date.now();
    }
    
    // Para qualquer outro caso, usar avatar padrão
    return this.DEFAULT_AVATAR;
  }

  onAvatarError() {
    // Se já está a usar o avatar padrão, não fazer nada
    if (this.avatarSrc === this.DEFAULT_AVATAR) {
      return;
    }
    this.avatarSrc = this.DEFAULT_AVATAR;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  irParaNovaMarcacao() {
    this.router.navigate(['/marcacoes']);
  }
}
