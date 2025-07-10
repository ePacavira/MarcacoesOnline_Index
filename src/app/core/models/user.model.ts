export interface User {
  id: string
  nome: string
  email: string
  perfil: UserRole
  createdAt: Date
  updatedAt: Date
}
export enum UserRole {
  ADMIN = "Administrador",
  REGISTADO = "Registado",
  ADMINISTRATIVO= "Administrativo",
  ANONIMO="Anonimo"
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
