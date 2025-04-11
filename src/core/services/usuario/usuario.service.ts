import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  nome: string;
  email: string;
}

export interface InstituicaoDTO {
  id: number;
  nomeFantasia: string;
  razaoSocial: string;
}

export interface AuthRequestDTO {
  email: string;
  senha: string;
}

export interface AuthResponseDTO {
  token: string | null;
  instituicoes: InstituicaoDTO[] | null;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}`;
  private usuarioUrl = `${this.apiUrl}/usuario`;
  private authUrl = `${this.apiUrl}/auth`;

  constructor(private http: HttpClient) {}


  iniciarLogin(request: AuthRequestDTO): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(`${this.authUrl}/login`, request);
  }

  finalizarLogin(email: string, instituicaoId: number): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(`${this.authUrl}/escolher-instituicao`, {
      email,
      instituicaoId
    }).pipe(
      map((response) => {
        if (response.token) {
          localStorage.setItem('token', response.token); // Salva o token localmente
        }
        return response;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ----------- USUÁRIOS (PROTEGIDOS) -----------

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(`${this.usuarioUrl}/list`, {
      headers: this.getAuthHeaders()
    });
  }

  getUsuarioById(id: number): Observable<User> {
    return this.http.get<User>(`${this.usuarioUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  createUsuario(userData: User): Observable<User> {
    return this.http.post<User>(`${this.usuarioUrl}/create`, userData, {
      headers: this.getAuthHeaders()
    });
  }

  updateUsuario(id: number, usuario: User): Observable<User> {
    return this.http.put<User>(`${this.usuarioUrl}/update/${id}`, usuario, {
      headers: this.getAuthHeaders()
    });
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.usuarioUrl}/delete/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
