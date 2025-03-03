import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  nome: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
    private apiUrl = 'http://192.168.0.125:8080/usuario';

    constructor(private http: HttpClient) {}

    getUsuarios(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/list`);
    }

    getUsuarioById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/list/${id}`);
    }
    
    createUsuario(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/create`, userData);
    }

    updateUsuario(usuario: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/update/${usuario.id}`, usuario);
    }

    deleteUsuario(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
    }
}
