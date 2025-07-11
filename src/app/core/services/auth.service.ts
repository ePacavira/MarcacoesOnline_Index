import { Injectable, inject, signal } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Router } from "@angular/router"
import { type Observable, BehaviorSubject, tap, catchError, throwError, of } from "rxjs"
import { User, LoginRequest, LoginResponse, UserRole } from "../models/user.model"
import { environment } from "../../../environments/environment"
import { delay } from "rxjs/operators";

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

  // Dados de exemplo para desenvolvimento
  private usuariosExemplo: User[] = [
    {
      id: 1,
      nome: "João Silva",
      email: "joao.silva@email.com",
      telefone: "+351 123 456 789",
      dataNascimento: new Date('1985-03-15'),
      endereco: "Rua das Flores, 123, 1000-001 Lisboa",
      nif: "123456789",
      numeroUtente: "123456789",
      tipoUsuario: "utente",
      perfil: UserRole.REGISTADO,
      foto: "/assets/user.jpg",
      notificacoesEmail: true,
      notificacoesSMS: true,
      newsletter: false
    },
    {
      id: 2,
      nome: "Maria Santos",
      email: "maria.santos@email.com",
      telefone: "+351 987 654 321",
      dataNascimento: new Date('1990-07-22'),
      endereco: "Avenida da Liberdade, 456, 4000-001 Porto",
      nif: "987654321",
      numeroUtente: "987654321",
      tipoUsuario: "utente",
      perfil: UserRole.REGISTADO,
      foto: undefined,
      notificacoesEmail: true,
      notificacoesSMS: false,
      newsletter: true
    },
    {
      id: 3,
      nome: "Admin Sistema",
      email: "admin@clinicamedi.pt",
      telefone: "+351 555 123 456",
      dataNascimento: new Date('1980-01-01'),
      endereco: "Clínica Medi, Rua Principal, 1000-001 Lisboa",
      nif: "111222333",
      numeroUtente: undefined,
      tipoUsuario: "admin",
      perfil: UserRole.ADMIN,
      foto: undefined,
      notificacoesEmail: true,
      notificacoesSMS: false,
      newsletter: false
    }
  ];

  constructor() {
    this.loadUserFromStorage()
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Simulação de login para desenvolvimento
    const usuario = this.usuariosExemplo.find(u => 
      u.email === credentials.email && 
      credentials.password === '123456' // Password padrão para todos os usuários
    );

    if (usuario) {
      const response: LoginResponse = {
        token: 'mock-jwt-token-' + usuario.id,
        refreshToken: 'mock-refresh-token-' + usuario.id,
        user: usuario
      };

      this.setSession(response);
      return of(response).pipe(
        tap(() => {
          console.log('Login bem-sucedido:', usuario.nome);
        })
      );
    } else {
      return throwError(() => new Error('Credenciais inválidas'));
    }

    // Código original para produção:
    // return this.http.post<LoginResponse>(`${environment.apiUrl}/Auth/login`, credentials).pipe(
    //   tap((response) => {
    //     this.setSession(response)
    //   }),
    //   catchError((error) => {
    //     console.error("Erro no login:", error)
    //     return throwError(() => error)
    //   }),
    // )
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
    return !!localStorage.getItem('token');
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
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

  // Método para atualizar perfil do usuário
  atualizarPerfil(dadosAtualizados: Partial<User>): Observable<User> {
    const userAtual = this.currentUser();
    if (!userAtual) {
      return throwError(() => new Error('Usuário não autenticado'));
    }

    const userAtualizado = { ...userAtual, ...dadosAtualizados };
    
    // Atualizar no storage
    localStorage.setItem("user", JSON.stringify(userAtualizado));
    
    // Atualizar no estado
    this.currentUserSubject.next(userAtualizado);
    this.currentUser.set(userAtualizado);

    return of(userAtualizado);
  }

  // Método para obter usuário atual
  getCurrentUser(): User | null {
    return this.currentUser();
  }

  // Método para simular criação de conta
  criarConta(dadosConta: any): Observable<any> {
    // Simular criação de conta
    const novaConta = {
      email: dadosConta.email,
      password: dadosConta.password,
      numeroUtente: this.gerarNumeroUtente(),
      tipoConta: 'Utente Registado'
    };

    // Salvar dados temporariamente para a página de sucesso
    localStorage.setItem('contaCriada', JSON.stringify(novaConta));

    return of(novaConta).pipe(delay(1000));
  }

  // Gerar número de utente único
  private gerarNumeroUtente(): string {
    return Math.floor(100000000 + Math.random() * 900000000).toString();
  }
}
