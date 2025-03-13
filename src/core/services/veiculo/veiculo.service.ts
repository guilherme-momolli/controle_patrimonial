import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Veiculo {
  id: number;
  nome: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class VeiculoService {
    private apiUrl = environment.apiUrl + '/veiculo';

    constructor(private http: HttpClient) {}

    getVeiculos(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/list`);
    }

    getVeiculoById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/list/${id}`);
    }
    
    createVeiculo(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/create`, userData);
    }

    updateVeiculo(veiculo: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/update/${veiculo.id}`, veiculo);
    }

    deleteVeiculo(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
    }
}
