import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { StorageService } from '../storage-service/storage-service.service';

interface AuthRequestDTO {
  email: string;
  senha: string;
}

export interface InstituicaoSimples {
  id: number;
  nomeFantasia: string;
}


interface FinalizarLoginDTO {
  email: string;
  instituicaoId: number;
}

interface AuthResponseDTO {
  token: string;
  usuarioNome: string,
  instituicoes?: InstituicaoSimples[];
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatus = new BehaviorSubject<boolean>(this.tokenExiste());
  authStatus$ = this.authStatus.asObservable();

  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: StorageService
  ) { }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  login(request: AuthRequestDTO): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(`${this.baseUrl}/login`, request).pipe(
      tap(response => {
        if (response.token) {
          this.salvarToken(response.token);
          this.storage.setItem('email', request.email);
          this.authStatus.next(true);
        }
    
        if (response.instituicoes) {
          this.salvarInstituicoes(response.instituicoes);
        }
      })
    );
    
  }

  finalizarLogin(request: FinalizarLoginDTO): Observable<AuthResponseDTO> {
    
    return this.http.post<AuthResponseDTO>(`${this.baseUrl}/finalizar-login`, request).pipe(
      tap(response => {
        this.salvarToken(response.token);
        this.storage.setItem('instituicaoId', request.instituicaoId);
        this.storage.setItem('email', request.email);
        this.storage.setItem('usuarioNome', response.usuarioNome);
        this.authStatus.next(true);
      })
    );
  }

  logout(): void {
    this.storage.removeItem('authToken');
    this.storage.removeItem('instituicaoId');
    this.storage.removeItem('instituicoes');
    this.storage.removeItem('email');
    this.authStatus.next(false);
    this.router.navigate(['/login']);
  }

  public getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  public getToken(): string | null {
    return this.storage.getItem<string>('authToken');
  }

  public getInstituicoes(): { id: number; nomeFantasia: string }[] | null {
    return this.storage.getItem<{ id: number; nomeFantasia: string }[]>('instituicoes');
  }

  public getUsuarioNome(): string | null {
    const payload = this.decodeToken();
    return payload?.usuarioNome ?? null;
  }

  public getInstituicaoNome(): string | null {
    const payload = this.decodeToken();
    return payload?.instituicaoNome ?? null;
  }

  public getEmail(): string | null {
    return this.storage.getItem<string>('email');
  }

  private salvarInstituicoes(instituicoes: { id: number; nomeFantasia: string }[]): void {
    this.storage.setItem('instituicoes', instituicoes);
  }

  public isAuthenticated(): boolean {
    return this.tokenExiste();
  }

  public getInstituicaoId(): number | null {
    const payload = this.decodeToken();
    return payload?.instituicaoId ?? null;
  }

  private salvarToken(token: string): void {
    this.storage.setItem('authToken', token);
    this.authStatus.next(true);
  }

  private tokenExiste(): boolean {
    try {
      return this.isBrowser() && !!localStorage.getItem('authToken');
    } catch (e) {
      console.error('Erro ao verificar token existente:', e);
      return false;
    }
  }

  private decodeToken(): any | null {
    const token = this.getToken();
    if (!token) return null;
  
    try {
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) return null;
  
      const decoded = decodeURIComponent(
        escape(atob(payloadBase64))
      );
  
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Erro ao decodificar token JWT:', error);
      return null;
    }
  }
  

  
  

}
