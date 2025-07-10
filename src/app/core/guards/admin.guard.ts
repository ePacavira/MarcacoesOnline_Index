import { inject } from "@angular/core"
import { Router, type CanActivateFn } from "@angular/router"
import { AuthService } from "../services/auth.service"

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.isAdminFull() || authService.isAdmin() || authService.isUtente()) {
    return true
  }

  router.navigate(["/login"])
  return false
}

export const utenteOnlyGuard: CanActivateFn = () => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.isUtente()) {
    return true
  }

  router.navigate(["/"])
  return false
}
