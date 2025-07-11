import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ActoClinico {
  id?: number;
  tipo: string;
  subsistemaSaude: string;
  profissional?: string;
  pedidoMarcacaoId?: number;
}

export interface PedidoMarcacao {
  id?: number;
  estado: number; // 0 = Pendente, 1 = Agendado, 2 = Realizado, 3 = Cancelado
  dataAgendada?: string;
  dataInicioPreferida?: string;
  dataFimPreferida?: string;
  horarioPreferido?: string;
  observacoes?: string;
  userId?: number;
  user?: any;
  actosClinicos?: ActoClinico[];
}

export interface PedidoAnonimoDto {
  numeroUtente: string;
  nomeCompleto: string;
  dataNascimento: string;
  genero: string;
  telemovel: string;
  email: string;
  morada: string;
  dataInicioPreferida: string;
  dataFimPreferida: string;
  horarioPreferido: string;
  observacoes?: string;
  actosClinicos: ActoClinico[];
}

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(private http: HttpClient) { }

  // Obter todos os pedidos (admin/administrativo)
  getAll(): Observable<PedidoMarcacao[]> {
    return this.http.get<PedidoMarcacao[]>(`${environment.apiUrl}/PedidoMarcacao`);
  }

  // Obter pedido por ID
  getById(id: number): Observable<PedidoMarcacao> {
    return this.http.get<PedidoMarcacao>(`${environment.apiUrl}/PedidoMarcacao/${id}`);
  }

  // Criar pedido autenticado
  create(pedido: PedidoMarcacao): Observable<PedidoMarcacao> {
    return this.http.post<PedidoMarcacao>(`${environment.apiUrl}/PedidoMarcacao`, pedido);
  }

  // Criar pedido anónimo
  createAnonimo(pedido: PedidoAnonimoDto): Observable<PedidoMarcacao> {
    return this.http.post<PedidoMarcacao>(`${environment.apiUrl}/PedidoMarcacao/anonimo`, pedido);
  }

  // Atualizar pedido
  update(id: number, pedido: PedidoMarcacao): Observable<any> {
    return this.http.put(`${environment.apiUrl}/PedidoMarcacao/${id}`, pedido);
  }

  // Eliminar pedido
  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/PedidoMarcacao/${id}`);
  }

  // Agendar pedido (admin/administrativo)
  agendar(id: number): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/PedidoMarcacao/admin/agendar/${id}`, {});
  }

  // Marcar como realizado (admin/administrativo)
  realizar(id: number): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/PedidoMarcacao/admin/realizar/${id}`, {});
  }

  // Obter pedidos por estado
  getByEstado(estado: string): Observable<PedidoMarcacao[]> {
    return this.http.get<PedidoMarcacao[]>(`${environment.apiUrl}/PedidoMarcacao/admin/pedidos/estado-nome/${estado}`);
  }

  // Obter histórico do utente autenticado
  getHistorico(): Observable<PedidoMarcacao[]> {
    return this.http.get<PedidoMarcacao[]>(`${environment.apiUrl}/PedidoMarcacao/user/historico`);
  }

  // Exportar PDF
  exportarPdf(id: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/PedidoMarcacao/${id}/pdf`, {
      responseType: 'blob'
    });
  }

  // Promover utente anónimo para registado
  promoverUtente(userId: number, dados: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/User/promover/${userId}`, dados);
  }

  // Obter pedidos recentes para o dashboard
  getPedidosRecentes(): Observable<PedidoMarcacao[]> {
    return this.http.get<PedidoMarcacao[]>(`${environment.apiUrl}/PedidoMarcacao/recentes`);
  }

  // Obter estatísticas do dashboard
  getEstatisticasDashboard(): Observable<{
    totalPedidos: number;
    pedidosPendentes: number;
    pedidosAgendados: number;
    pedidosRealizados: number;
  }> {
    return this.http.get<{
      totalPedidos: number;
      pedidosPendentes: number;
      pedidosAgendados: number;
      pedidosRealizados: number;
    }>(`${environment.apiUrl}/PedidoMarcacao/estatisticas`);
  }
} 