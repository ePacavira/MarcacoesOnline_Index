import type { Routes } from "@angular/router"
import { authGuard } from "../core/guards/auth.guard"
import { adminGuard } from "../core/guards/admin.guard"

export const gestaoRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./layout/gestao-layout.component").then((m) => m.GestaoLayoutComponent),
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        loadComponent: () => import("./pages/dashboard/dashboard.component").then((m) => m.DashboardComponent),
      },
      {
        path: "pacientes",
        loadComponent: () => import("./pages/pacientes/pacientes.component").then((m) => m.UtenteComponent),
      },
      {
        path: "consulta",
        loadComponent: () => import("./pages/pacientes/pacientes.component").then((m) => m.UtenteComponent),
      },
      {
        path: "marcacoes",
        loadComponent: () => import("./pages/marcacoes/marcacoes.component").then((m) => m.MarcacoesComponent),
      },
    ]
  },
]
