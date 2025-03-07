import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NotaFiscal {
  id: number;
  nome: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotaFiscalService {
    private apiUrl = 'http://192.168.0.125:8080/nota_fiscal';

    constructor(private http: HttpClient) {}

    getNotaFiscal(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/list`);
    }

    getNotaFiscalById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/list/${id}`);
    }
    
    createNotaFiscal(hardwareData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/create`, hardwareData);
    }

    updateFiscal(hardware: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/update/${hardware.id}`, hardware);
    }

    deleteNotaFiscal(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
    }
}
