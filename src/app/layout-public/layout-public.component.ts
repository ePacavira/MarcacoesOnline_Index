import { Component, computed, inject, signal } from "@angular/core"
import { HeaderComponent } from "../shared/app-header/header.component";
import { AppFooterComponent } from "../shared/app-footer/app-footer.component";
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from "../core/services/auth.service";
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-layout-public',
  imports: [RouterModule, HeaderComponent, AppFooterComponent],
  template: `
    @if (!authService.isAuthenticated()) {
        @if (!isLoginPage()) {
          <app-header></app-header>
        }
         <router-outlet></router-outlet>
        @if (!isLoginPage()) {
          <app-footer></app-footer>
        }
    }@else{
         @if (showMenus()) {
          @if (!isLoginPage()) {
            <app-header></app-header>
          }
        }
      <router-outlet></router-outlet>

          @if (showMenus()) {
            @if (!isLoginPage()) {
              <app-footer></app-footer>
            }
        }
    }
  `,
})

export class LayoutPublicComponent {
  authService = inject(AuthService);
  router = inject(Router);

  currentUrl = signal(this.router.url);

  constructor() {
    // Atualiza a URL toda vez que houver navegação
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });
  }

  // Mostra os menus apenas se a rota **não** contiver 'gestao/'
  showMenus = computed(() => !this.currentUrl().includes('gestao/'));

  // Não mostra o header/footer na página de login, utente ou marcações
  isLoginPage = () => this.currentUrl().startsWith('/login') || this.currentUrl().startsWith('/utente') || this.currentUrl().startsWith('/marcacoes');
}