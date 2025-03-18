import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Hardware {
  id: number;
  codigoPatrimonial: string;
  componente: string;
  numeroSerial: string;
  modelo: string;
  fabricante: string;
  velocidade: string;
  capacidadeArmazenamento: string;
  dataFabricacao: string;
  precoTotal: number;
  estatus: string;
  voltagem: number;
  imagemUrl?: string;  
}


@Injectable({
  providedIn: 'root'
})
export class HardwareService {
  private apiUrl = environment.apiUrl + '/hardware';
  private fileUrl = environment.apiUrl + '/files';

  constructor(private http: HttpClient) {}

  getHardwares(): Observable<Hardware[]> {
    return this.http.get<Hardware[]>(`${this.apiUrl}/list`)/*.pipe(
      tap(data => console.log('Hardwares carregados:', data)),
      catchError(this.handleError)
    );*/
  }

  getHardwareById(id: number): Observable<Hardware> {
    return this.http.get<Hardware>(`${this.apiUrl}/list/${id}`)/*.pipe(
      tap(data => console.log(`Hardware encontrado: ${data}`)),
      catchError(this.handleError)
    );*/
  }

  getHardwareByCodigoPatrimonial(codigoPatrimonial: string): Observable<Hardware> {
    return this.http.get<Hardware>(`${this.apiUrl}/list/patrimonio/${codigoPatrimonial}`)/*.pipe(
      tap(data => console.log(`Hardware encontrado por patrimônio: ${data}`)),
      catchError(this.handleError)
    );*/
  }
  getHardwaresAgrupados(): Observable<{ [codigoPatrimonial: string]: Hardware[] }> {
    return this.http.get<{ [codigoPatrimonial: string]: Hardware[] }>(`${this.apiUrl}/list/agrupado`)/*.pipe(
      catchError(this.handleError)
    );*/
  }
  createHardware(hardwareData: FormData): Observable<Hardware> {
    return this.http.post<Hardware>(`${this.apiUrl}/create`, hardwareData);
  }
  

  updateHardware(hardware: Hardware): Observable<Hardware> {
    return this.http.put<Hardware>(`${this.apiUrl}/update/${hardware.id}`, hardware)/*.pipe(
      tap(data => console.log(`Hardware atualizado: ${data}`)),
      catchError(this.handleError)
    );*/
  }
  deleteHardware(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`)/*.pipe(
      tap(() => console.log(`Hardware ID ${id} deletado`)),
      catchError(this.handleError)
    );*/
  } 


  uploadImagem(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/${id}/upload-image`, formData);
  }
  

  getImagemUrl(imagemUrl: string | undefined): string {
    if (!imagemUrl) {
      return 'assets/default-image.png';
    }
    return imagemUrl.startsWith('http') ? imagemUrl : `${this.fileUrl}/${imagemUrl.split('/').pop()}`;
  }
  

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Erro desconhecido!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro do cliente: ${error.error.message}`;
    } else {
      errorMessage = `Erro do servidor (${error.status}): ${error.message}`;
    }
    console.error('Erro na API:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
