import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = 'http://192.168.0.125:8080';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  getUsuarios(): Observable<any[]>{
    return this.http.get<any[]>(`${this.API_URL}/usuario/list`);
  }

  createUsuario(userData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/usuario/create`, userData);
  }

  // loginUsuario(userData: any){
  //   return this.http.post(`${this.API_URL}/usuario/login`, userData);
  // }
}
