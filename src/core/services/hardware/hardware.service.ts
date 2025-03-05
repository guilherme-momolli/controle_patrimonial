import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Timestamp } from 'rxjs';

export interface Hardware {
  id: number;
  codigoPatrimonial: string;
  componente: string;
  fabricante: string;
  velocidade: string;
  numeroSerial: string;
  modelo: string,
  capacidadeArmazenamento: string;
  precoTotal: number;
  estatus: string;
  dataFabricacao: string;
  // notaFiscal: number;
}
@Injectable({
  providedIn: 'root'
})
export class HardwareService {

  private apiUrl = 'http://192.168.0.125:8080/hardware';
  
  constructor(private http: HttpClient) {}

  getHardwares(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/list`);
  }

  getHardwareById(id: number): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/list/${id}`);
  }
    
  getHardwareByCodigoPatrimonial(codigoPatrimonial: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/list/patrimonio/${codigoPatrimonial}`);
  } 

  getHardwaresAgrupados(): Observable<{ [codigoPatrimonial: string]: Hardware[] }> {
    return this.http.get<{ [codigoPatrimonial: string]: Hardware[] }>(`${this.apiUrl}/list/agrupado`);
  }

  createHardware(userData: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/create`, userData);
  }

  updateHardware(hardware: any): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/update/${hardware.id}`, hardware);
  }

  deleteHardware(id: number): Observable<any> {
      return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }
}
