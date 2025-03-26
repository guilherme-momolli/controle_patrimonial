import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { FileService } from '../file/file.service';

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
  
  constructor(private http: HttpClient, private fileService: FileService) {}

  getHardwares(): Observable<Hardware[]> {
    return this.http.get<Hardware[]>(`${this.apiUrl}/list`);
  }

  getHardwareById(id: number): Observable<Hardware> {
    return this.http.get<Hardware>(`${this.apiUrl}/list/${id}`);
  }

  getHardwareByCodigoPatrimonial(codigoPatrimonial: string): Observable<Hardware> {
    return this.http.get<Hardware>(`${this.apiUrl}/list/patrimonio/${codigoPatrimonial}`);
  }

  getHardwaresAgrupados(): Observable<{ [codigoPatrimonial: string]: Hardware[] }> {
    return this.http.get<{ [codigoPatrimonial: string]: Hardware[] }>(`${this.apiUrl}/list/agrupado`);
  }

  createHardware(hardware: Hardware, imagem?: File): Observable<Hardware> {
    const formData = new FormData();
  
    formData.append('hardware', new Blob([JSON.stringify(hardware)], { type: 'application/json' }));
  
    if (imagem) {
      formData.append('file', imagem, imagem.name);
    }
  
    return this.http.post<Hardware>(`${this.apiUrl}/create`, formData).pipe(
      catchError(this.handleError)
    );
  }
  
  updateHardware(id: number, hardware: Hardware, imagem?: File): Observable<Hardware> {
    const formData = new FormData();
  
    formData.append('hardware', new Blob([JSON.stringify(hardware)], { type: 'application/json' }));
  
    if (imagem) {
      formData.append('file', imagem, imagem.name);
    }
  
    return this.http.put<Hardware>(`${this.apiUrl}/update/${id}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  deleteHardware(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  /**
   * Faz o upload de uma imagem associada a um hardware.
   * @param file Arquivo a ser enviado
   * @returns Observable com a URL da imagem retornada pelo backend
   */
    uploadImagem(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<{ url: string }>(`${this.fileUrl}/uploadFile`, formData).pipe(
      tap(response => console.log(`Imagem enviada com sucesso`, response)),
      map(response => response.url),
      catchError(this.handleError)
    );
  }

    /**
   * Obtém a URL da imagem de um hardware pelo ID.
   * @param id ID do hardware
   * @returns Observable com a URL da imagem
   */
    getImagemUrlById(id: number): Observable<string> {
      return this.getHardwareById(id).pipe(
        map(hardware => 
          hardware.imagemUrl ? `${this.fileUrl}/getFile/${hardware.imagemUrl}` : 'assets/default-image.png'
        ),
        catchError(this.handleError)
      );
    }

  /**
   * Retorna a URL da imagem no servidor ou uma imagem padrão caso não haja uma associada.
   * @param imagemUrl Nome do arquivo armazenado no backend
   * @returns URL da imagem
   */
  getImagemUrl(imagemUrl?: string): string {
    return imagemUrl ? `${this.fileUrl}/getFile/${imagemUrl}` : 'assets/default-image.png';
  }

  /**
   * Trata os erros da API e retorna mensagens amigáveis.
   */
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
