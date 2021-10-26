import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpResponse } from "src/app/shared/model/http-response";

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  apiEndpoint = environment.gsApiUrl;

  constructor(private http: HttpClient) {}

  saveView(formData: any) {
    return this.http.post<HttpResponse>(
      `${this.apiEndpoint}/datView/addOrEditView`,
      formData
    );
  }
}
