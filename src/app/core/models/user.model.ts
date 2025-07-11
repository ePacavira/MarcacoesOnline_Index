export interface User {
  id: number
  nome: string
  email: string
  telefone?: string
  dataNascimento?: Date
  endereco?: string
  nif?: string
  numeroUtente?: string
  tipoUsuario: 'utente' | 'admin' | 'medico'
  perfil: UserRole
  foto?: string | null
  notificacoesEmail?: boolean
  notificacoesSMS?: boolean
  newsletter?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export enum UserRole {
  ADMIN = "Administrador",
  REGISTADO = "Registado",
  ADMINISTRATIVO = "Administrativo",
  ANONIMO = "Anonimo"
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
}

export interface PerfilUpdateRequest {
  nome?: string
  email?: string
  telefone?: string
  dataNascimento?: Date
  endereco?: string
  nif?: string
  foto?: string
  notificacoesEmail?: boolean
  notificacoesSMS?: boolean
  newsletter?: boolean
}
