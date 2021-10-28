import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
  })
export class ContentSearchService {
    apiEndpoint = environment.gsApiUrl;

    constructor(private http: HttpClient) { }

    getAllContentObjects(searchText: string) {
        return this.http.get<any[]>(`${this.apiEndpoint}/search/searchText?searchText=${encodeURIComponent(searchText)}`);
    }
}