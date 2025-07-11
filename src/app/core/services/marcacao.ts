import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PedidoMarcacao, CreatePedidoMarcacao } from '../../models/marcacao.interface';


@Injectable({
  providedIn: 'root',
})
export class MarcacaoService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/PedidoMarcacao`;

  getMarcacoes(): Observable<PedidoMarcacao[]> {
    return this.http.get<PedidoMarcacao[]>(this.baseUrl);
  }

  getMarcacaoById(id: string): Observable<PedidoMarcacao> {
    return this.http.get<PedidoMarcacao>(`${this.baseUrl}/${id}`);
  }

  createMarcacao(data: CreatePedidoMarcacao): Observable<PedidoMarcacao> {
    return this.http.post<PedidoMarcacao>(this.baseUrl, data);
  }

  updateMarcacao(id: string, data: Partial<PedidoMarcacao>): Observable<PedidoMarcacao> {
    return this.http.put<PedidoMarcacao>(`${this.baseUrl}/${id}`, data);
  }

  deleteMarcacao(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  enviarCredenciais(pedidoId:  string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/enviar-credenciais`, { pedidoId });
  }
  criarMarcacaoAnonima(data: CreatePedidoMarcacao): Observable<PedidoMarcacao> {
    return this.http.post<PedidoMarcacao>(`${environment.apiUrl}/anonimo`, data);
  }
}
