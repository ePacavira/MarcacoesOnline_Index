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
      }
    ]
  },
  // Privado (gestao) - fora do LayoutPublicComponent
  {
    path: 'gestao',
    //canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./gestao/gestao.routes').then((m) => m.gestaoRoutes),
  },
  // Rota coringa
  { path: '**', component: NotFoundComponent }
];

