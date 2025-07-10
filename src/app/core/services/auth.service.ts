import { Injectable, inject, signal } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Router } from "@angular/router"
import { type Observable, BehaviorSubject, tap, catchError, throwError } from "rxjs"
import type { User, LoginRequest, LoginResponse } from "../models/user.model"
import { environment } from "../../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private http = inject(HttpClient)
  private router = inject(Router)

  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  // Signals para estado reativo
  public isAuthenticated = signal(false)
  public currentUser = signal<User | null>(null)

  constructor() {
    this.loadUserFromStorage()
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/Auth/login`, credentials).pipe(
      tap((response) => {
        this.setSession(response)
      }),
      catchError((error) => {
        console.error("Erro no login:", error)
        return throwError(() => error)
      }),
    )
  }

  logout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    this.currentUserSubject.next(null)
    this.isAuthenticated.set(false)
    this.currentUser.set(null)
    this.router.navigate(["/login"])
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = localStorage.getItem("refreshToken")
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap((response) => {
        this.setSession(response)
      }),
    )
  }

  private setSession(authResult: LoginResponse): void {
    localStorage.setItem("token", authResult.token)
    localStorage.setItem("refreshToken", authResult.refreshToken)
    localStorage.setItem("user", JSON.stringify(authResult.user))

    this.currentUserSubject.next(authResult.user)
    this.isAuthenticated.set(true)
    this.currentUser.set(authResult.user)
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        this.currentUserSubject.next(user)
        this.isAuthenticated.set(true)
        this.currentUser.set(user)
      } catch (error) {
        console.error("Erro ao carregar usuário do storage:", error)
        this.logout()
      }
    }
  }

  getToken(): string | null {
    return localStorage.getItem("token")
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // ou 'user', 'auth', etc.
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    console.log(user)
    return user?.perfil === role
  }

  isAdminFull(): boolean {
    return this.hasRole("Administrador")
  }
  
  isAdmin(): boolean {
    return this.hasRole("Administrativo")
  }

  isUtente(): boolean {
    return this.hasRole("Registado")
  }
}
