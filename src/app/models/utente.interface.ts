export interface Utente {
  numeroUtente: string;
  fotografia?: File | string; // Pode ser o ficheiro ou o nome/URL
  nomeCompleto: string;
  dataNascimento: string; // ou Date
  genero: 'Masculino' | 'Feminino' | 'Outro' | 'PrefiroNaoIndicar';
  telemovel: string;
  email: string;
  morada: {
    rua?: string;
    numeroPorta?: string;
    andarLado?: string;
    codigoPostal: string;
    localidade: string;
    pais?: string;
  };
}


export interface IUtente {
  id: string
  numeroUtente: string
  nomeCompleto: string
  email: string
  telemovel: string
  genero: string
  dataNascimento: string
  rua: string
  numeroPorta: string
  andarLado: string
  localidade: string
  fotografia?: string
  anonimo: boolean
  usuario: {
    id: string
    nome: string
    email: string
    createdOn: string
    perfil: number
  }[]
}