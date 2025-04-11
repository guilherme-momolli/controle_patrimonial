import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
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
  private apiUrl = `${environment.apiUrl}/hardware`;
  private fileUrl = `${environment.apiUrl}/file/v1`;

  constructor(private http: HttpClient) {}

  getHardwares(): Observable<Hardware[]> {
    return this.http.get<Hardware[]>(`${this.apiUrl}/list`).pipe(catchError(this.handleError));
  }

  getHardwareById(id: number): Observable<Hardware> {
    return this.http.get<Hardware>(`${this.apiUrl}/list/${id}`).pipe(catchError(this.handleError));
  }

  getHardwareByInstituicao(instituicaoId: number): Observable<Hardware> {
    return this.http.get<Hardware>(`${this.apiUrl}/instituicao/${instituicaoId}`).pipe(catchError(this.handleError))
  }

  getHardwareByCodigoPatrimonial(codigoPatrimonial: string): Observable<Hardware> {
    return this.http.get<Hardware>(`${this.apiUrl}/list/patrimonio/${codigoPatrimonial}`).pipe(catchError(this.handleError));
  }

  getHardwaresAgrupados(): Observable<{ [codigoPatrimonial: string]: Hardware[] }> {
    return this.http.get<{ [codigoPatrimonial: string]: Hardware[] }>(`${this.apiUrl}/list/agrupado`).pipe(catchError(this.handleError));
  }

  createHardware(hardware: Hardware, imagem?: File): Observable<Hardware> {
    const formData = this.prepareFormData(hardware, imagem);
    return this.http.post<Hardware>(`${this.apiUrl}/create`, formData).pipe(catchError(this.handleError));
  }

  /** Atualiza um hardware existente */
  updateHardware(id: number, hardware: Hardware, imagem?: File): Observable<Hardware> {
    const formData = this.prepareFormData(hardware, imagem);
    return this.http.put<Hardware>(`${this.apiUrl}/update/${id}`, formData).pipe(catchError(this.handleError));
  }

  /** Exclui um hardware */
  deleteHardware(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`).pipe(catchError(this.handleError));
  }

  /** Faz upload de uma imagem */
  uploadImagem(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<{ fileName: string }>(`${this.fileUrl}/uploadFile`, formData).pipe(
      tap(response => console.log(`Imagem enviada com sucesso`, response)),
      map(response => `${this.fileUrl}/getFile/${response.fileName}`),
      catchError(this.handleError)
    );
  }

  /** Obtém a URL da imagem associada a um hardware pelo ID */
  getImagemUrlById(id: number): Observable<string> {
    return this.getHardwareById(id).pipe(
      map(hardware => (hardware.imagemUrl ? `${this.fileUrl}/getFile/${hardware.imagemUrl}` : 'assets/default-image.png')),
      catchError(this.handleError)
    );
  }

  getImagemUrl(imagemUrl?: string): string {
    return imagemUrl ? `${this.fileUrl}/getFile/${imagemUrl}` : 'assets/default-image.png';
  }

  private prepareFormData(hardware: Hardware, imagem?: File): FormData {
    const formData = new FormData();
    formData.append('hardware', new Blob([JSON.stringify(hardware)], { type: 'application/json' }));

    if (imagem) {
      formData.append('file', imagem, imagem.name);
    }
    return formData;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Erro desconhecido!';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro do cliente: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Requisição inválida. Verifique os dados enviados.';
          break;
        case 404:
          errorMessage = 'Recurso não encontrado. Verifique se o ID está correto.';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          break;
        default:
          errorMessage = `Erro inesperado (${error.status}): ${error.message}`;
      }
    }

    console.error('Erro na API:', errorMessage, 'Detalhes:', error.error);
    return throwError(() => new Error(errorMessage));
  }
}
