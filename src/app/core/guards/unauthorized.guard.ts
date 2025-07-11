import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const unauthorizedGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  // Se não estiver autenticado, redirecionar para login
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }
  
  // Se estiver autenticado mas não tiver permissão, redirecionar para unauthorized
  router.navigate(['/unauthorized']);
  return false;
}; 