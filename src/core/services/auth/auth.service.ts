import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';

export interface Instituicao {
  id: number;
  nomeFantasia: string;
}

export interface AuthResponse {
  token?: string;
  instituicoes?: Instituicao[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private authStatusSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  authStatus$ = this.authStatusSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  login(credentials: { email: string; senha: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  finalizarLogin(email: string, instituicaoId: number): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/finalizar-login`, { email, instituicaoId })
      .pipe(
        tap(response => {
          if (response?.token) {
            this.setToken(response.token);
            this.authStatusSubject.next(true);
          }
        })
      );
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem(this.TOKEN_KEY)
      : null;
  }

  hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  getDecodedToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }

  getUsuarioId(): number | null {
    return this.getDecodedToken()?.id ?? null;
  }

  getInstituicaoId(): number | null {
    return this.getDecodedToken()?.instituicaoId ?? null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      this.authStatusSubject.next(false);
    }
  }
}
