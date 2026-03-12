import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PlanejamentoService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDisciplinas(): Observable<{ id: number; nome: string }[]> {
    return this.http.get<{ id: number; nome: string }[]>(`${this.api}/disciplinas`);
  }

  getHabilidades(disciplinaId: number): Observable<{ id: number; descricao: string }[]> {
    return this.http.get<{ id: number; descricao: string }[]>(`${this.api}/disciplinas/${disciplinaId}/habilidades`);
  }

  criar(dados: any): Observable<any> {
    return this.http.post(`${this.api}/planejamentos`, dados);
  }

  listar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/planejamentos`);
  }

  downloadUrl(id: number): string {
    return `${this.api}/planejamentos/${id}/download`;
  }
}
