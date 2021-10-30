import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    apiEndpoint = environment.gsApiUrl;

    constructor(private http: HttpClient) { }

    fetchConfigurations(spaceGuid: string) {
        return this.http.get<any>(
            `${this.apiEndpoint}/space/${spaceGuid}/configs`
        );
    }
}