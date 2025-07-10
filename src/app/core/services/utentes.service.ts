import { Injectable, inject } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import type { Observable } from "rxjs"
import { environment } from "../../../environments/environment"
import { IUtente } from "../../models/utente.interface"

@Injectable({
  providedIn: "root",
})
export class UtenteService {
  private http = inject(HttpClient)
  private apiUrl = `${environment.apiUrl}/Utente`

  // Buscar lista de utentes com filtros opcionais
  getUtentes(filters?: {
    nomeCompleto?: string
    numeroUtente?: string
    email?: string
    genero?: string
  }): Observable<IUtente[]> {
    let params = new HttpParams()

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params = params.set(key, value.toString())
        }
      })
    }

    return this.http.get<IUtente[]>(this.apiUrl, { params })
  }

  // Buscar um utente por ID
  getUtenteById(id: string): Observable<IUtente> {
    return this.http.get<IUtente>(`${this.apiUrl}/${id}`)
  }

  // Criar novo utente
  createUtente(utente: Partial<any>): Observable<IUtente> {
    return this.http.post<IUtente>(this.apiUrl, utente)
  }

  // Atualizar utente
  updateUtente(id: string, utente: Partial<IUtente>): Observable<IUtente> {
    return this.http.put<IUtente>(`${this.apiUrl}/${id}`, utente)
  }

  // Eliminar utente
  deleteUtente(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}
