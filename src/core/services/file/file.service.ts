import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {

   private apiUrl = `${environment.apiUrl}/file/v1`; // Se necessário, troque por environment.apiUrl + '/file/v1'

   constructor(private http: HttpClient) {}
 
   /**
    * Upload de um único arquivo
    * @param file Arquivo a ser enviado
    * @returns Observable com a resposta do servidor
    */
   uploadFile(file: File): Observable<any> {
     const formData: FormData = new FormData();
     formData.append('file', file, file.name);
 
     return this.http.post(`${this.apiUrl}/uploadFile`, formData, {
       headers: { 'Accept': 'application/json' }
     });
   }
 
   /**
    * Upload de múltiplos arquivos
    * @param files Lista de arquivos a serem enviados
    * @returns Observable com a resposta do servidor
    */
   uploadMultipleFiles(files: File[]): Observable<any> {
     const formData: FormData = new FormData();
     files.forEach(file => formData.append('files', file, file.name));
 
     return this.http.post(`${this.apiUrl}/uploadMultipleFiles`, formData, {
       headers: { 'Accept': 'application/json' }
     });
   }
 
   /**
    * Download de arquivo pelo nome
    * @param fileName Nome do arquivo no servidor
    * @returns Observable contendo o Blob do arquivo
    */
   downloadFile(fileName: string): Observable<Blob> {
     return this.http.get(`${this.apiUrl}/downloadFile/${fileName}`, {
       responseType: 'blob'
     });
   }
 }
 
