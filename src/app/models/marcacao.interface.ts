
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
  id?: number;
  dataInicioPreferida: string | Date; // aceita string ou Date
  dataFimPreferida: string | Date;
  dataCriacao?: string | Date; // aceita string ou Date
  horarioPreferido: 'Manhã' | 'Tarde' | 'Noite' | string;
  observacoes: string;
  estado: 'Agendado' | 'Pendente' | 'Cancelado' | 'Concluído' | string;
  actosClinicos: ActoClinico[];
  utenteId?: string;
  nomeUtente?: string;
  userId?: number;
}

export interface CreatePedidoMarcacao {
  estado: number; // 0 = Pendente, 1 = Agendado, 2 = Cancelado, 3 = Concluído
  dataInicioPreferida: string;
  horaInicioPreferida: string;
  dataFimPreferida: string;
  horaFimPreferida: string;
  horarioPreferido: string; // manter para compatibilidade
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