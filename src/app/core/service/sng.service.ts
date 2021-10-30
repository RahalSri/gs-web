import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { TopologyData } from 'src/app/shared/model/topology-data';
import { environment } from 'src/environments/environment';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class SngService {
    apiEndpoint = environment.gsApiUrl;

    constructor(private http: HttpClient) {}

    getGraphJSON(spcGuid: string, viewGuid: string, objectGuid: string) {
        return this.http.get<TopologyData>(`${this.apiEndpoint}/datView/getSubjectNetworkContent/${spcGuid}/${viewGuid}/${objectGuid}`);
    }
}
