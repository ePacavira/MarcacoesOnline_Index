import { inject } from "@angular/core"
import { Router, type CanActivateFn } from "@angular/router"
import { AuthService } from "../services/auth.service"

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  // Se não estiver autenticado, redirecionar para login
  if (!authService.isAuthenticated()) {
    router.navigate(["/login"], { queryParams: { returnUrl: state.url } })
    return false
  }

  // Se estiver autenticado mas não tiver permissão de admin, redirecionar para unauthorized
  if (authService.isAdminFull() || authService.isAdmin() || authService.isUtente()) {
    return true
  }

  router.navigate(["/unauthorized"])
  return false
}

export const utenteOnlyGuard: CanActivateFn = () => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.isUtente()) {
    return true
  }

  router.navigate(["/unauthorized"])
  return false
}
