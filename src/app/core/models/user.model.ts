export interface User {
  id: number;
  nomeCompleto: string;
  email: string;
  telefone?: string;
  telemovel?: string;
  dataNascimento?: string;
  endereco?: string;
  nif?: string;
  numeroUtente?: string;
  genero?: string;
  morada?: string;
  fotoPath?: string;
  perfil: UserRole;
  notificacoesEmail?: boolean;
  notificacoesSMS?: boolean;
  newsletter?: boolean;
  pedidos?: any[];
  createdAt?: Date;
  updatedAt?: Date;
  createdOn?: string;
}

export enum UserRole {
  ANONIMO = 0,
  REGISTADO = 1,
  ADMINISTRATIVO = 2,
  ADMIN = 3
}

// Mapeamento para facilitar comparações
export const UserRoleLabels = {
  [UserRole.ANONIMO]: 'Anónimo',
  [UserRole.REGISTADO]: 'Registado',
  [UserRole.ADMINISTRATIVO]: 'Administrativo',
  [UserRole.ADMIN]: 'Administrador'
};

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface PerfilUpdateRequest {
  nomeCompleto?: string;
  email?: string;
  telefone?: string;
  dataNascimento?: string;
  endereco?: string;
  nif?: string;
  fotoPath?: string;
  notificacoesEmail?: boolean;
  notificacoesSMS?: boolean;
  newsletter?: boolean;
}
