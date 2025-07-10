export interface ActoClinico {
  id:number | string
  tipoConsultaExame: string;
  subsistemaSaude: string;
  profissional?: string;
  preco?:number
}