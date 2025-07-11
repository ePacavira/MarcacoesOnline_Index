
export interface ActoClinico {
   id: string;
  tipo: string;
  subsistemaSaude: string;
  profissional: string;
}

export interface CreateActoClinico {
  tipo: string;
  subsistemaSaude: string;
  profissional: string;
}

export interface PedidoMarcacao {
  id?: string;
  dataInicioPreferida: string; // ou Date, se usares objetos de data
  dataFimPreferida: string;
  horarioPreferido: 'Manhã' | 'Tarde' | 'Noite' | string;
  observacoes: string;
  estado: 'Agendado' | 'Pendente' | 'Cancelado' | 'Concluído' | string;
  actosClinicos: ActoClinico[];
  utenteId?: string;
  nomeUtente?: string
}

export interface CreatePedidoMarcacao {
  estado: number; // 0 = Pendente, 1 = Agendado, 2 = Cancelado, 3 = Concluído
  dataInicioPreferida: string;
  dataFimPreferida: string;
  horarioPreferido: string;
  observacoes: string;
  userId?: number;
  actosClinicos: CreateActoClinico[];
}

export interface FilterOption {
  id: string;
  value: string;
  label: string;
  checked?: boolean;
}