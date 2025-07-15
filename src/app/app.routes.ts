import { Routes } from '@angular/router';
import { LayoutPublicComponent } from './layout-public/layout-public.component';
import { HomeComponent } from './pages/home/home.component';
import { SobreComponent } from './pages/sobre/sobre.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { LoginComponent } from './pages/login/login.component';
import { ConsultaComponent } from './pages/consulta/marcacao.component';
import { UtenteComponent } from './pages/utente/utente.component';
import { ServicosComponent } from './pages/servicos/servicos.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { UtenteService } from './core/services/utentes.service';
import { MarcacaoService } from './core/services/marcacao';
import { UsersService } from './core/services/users.service';

export const routes: Routes = [
  // Público
  {
    path: '',
    component: LayoutPublicComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'sobre', component: SobreComponent },
      { path: 'servicos', component: ServicosComponent },
      { path: 'contacto', component: ContactoComponent },
      { path: 'utente', component: UtenteComponent },
      { path: 'login', component: LoginComponent },
      { path: 'marcacoes', component: ConsultaComponent },
      {
        path: 'marcacao-anonima',
        loadComponent: () => import('./pages/marcacao-anonima/marcacao-anonima.component').then(m => m.MarcacaoAnonimaComponent)
      },
      {
        path: 'consulta-marcacao',
        loadComponent: () => import('./pages/consulta-marcacao/consulta-marcacao.component').then(m => m.ConsultaMarcacaoComponent)
      },
      {
        path: 'marcacao-sucesso',
        loadComponent: () => import('./pages/marcacao-sucesso/marcacao-sucesso.component').then(m => m.MarcacaoSucessoComponent)
      },
      {
        path: 'conta-criada',
        loadComponent: () => import('./pages/conta-criada/conta-criada.component').then(m => m.ContaCriadaComponent)
      }
    ]
  },
  // Área do Utente
  {
    path: 'utente',
    canActivate: [authGuard],
    loadComponent: () => import('./gestao/layout/gestao-layout.component').then((m) => m.GestaoLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./gestao/pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'minhas-marcacoes',
        loadComponent: () => import('./gestao/pages/marcacoes/marcacoes.component').then((m) => m.MarcacoesComponent),
      },
      {
        path: 'minhas-marcacoes/:id',
        loadComponent: () => import('./gestao/pages/marcacoes/marcacao-detalhe-utente.component').then((m) => m.MarcacaoDetalheUtenteComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./gestao/pages/profile/profile.component').then((m) => m.ProfileComponent),
      },
    ]
  },
  // Área Administrativa
  {
    path: 'admintr',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./gestao/layout/gestao-layout.component').then((m) => m.GestaoLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./admintr/pages/dashboard/dashboard.component').then((m) => m.AdmintrDashboardComponent),
      },
      {
        path: 'pedidos',
        loadComponent: () => import('./admintr/pages/pedidos/pedidos.component').then((m) => m.PedidosComponent),
      },
      {
        path: 'pedido/:id',
        loadComponent: () => import('./admintr/pages/pedido-detalhe/pedido-detalhe.component').then((m) => m.PedidoDetalheComponent),
      },
    ]
  },
  // Área Super Administrador
  {
    path: 'super',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./gestao/layout/gestao-layout.component').then((m) => m.GestaoLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./super/pages/dashboard/dashboard.component').then((m) => m.SuperDashboardComponent),
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./super/pages/usuarios/usuarios.component').then((m) => m.UsuariosComponent),
      },
    ]
  },
  // Privado (gestao) - fora do LayoutPublicComponent
  {
    path: 'gestao',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./gestao/gestao.routes').then((m) => m.gestaoRoutes),
  },
  // Páginas de Erro
  { 
    path: 'unauthorized', 
    loadComponent: () => import('./pages/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent) 
  },
  // Rota coringa
  { path: '**', component: NotFoundComponent }
];

