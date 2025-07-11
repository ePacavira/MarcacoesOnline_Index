import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

export const AuthInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  
  // Obter token do localStorage
  const token = localStorage.getItem('jwt_token');
  
  if (token) {
    // Adicionar token ao header Authorization
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expirado ou inválido
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('current_user');
        router.navigate(['/login']);
      } else if (error.status === 403) {
        // Acesso negado
        router.navigate(['/unauthorized']);
      }
      return throwError(() => error);
    })
  );
};
