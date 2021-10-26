import { Injectable, Query } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QueryService {
  apiEndpoint = environment.gsApiUrl;

  constructor(private http: HttpClient) { }

  fetchAllQueryList() {
    return this.http.get<Array<Query>>(
      `${this.apiEndpoint}/queryBuider/getAllQueryList`
    );
  }

  detachQuery(qryId: string, viewId: string) {
    return this.http.post<any>(
      `${this.apiEndpoint}/queryBuider/detachQueryFromView`,
      {
        queryId: qryId,
        viewId: viewId
      }
    );
  }

  discardQuery(qryId:string) {
    return this.http.post<any>(
      `${this.apiEndpoint}/queryBuider/discardQuery`,
      {
        queryId: qryId
      }
    );
  }

  fetchSpaceswithMetaLanguages(metaSupGuid: string) {
    return this.http.get<[]>(
      `${this.apiEndpoint}/queryBuider/getSpacesWithMetaLang/${metaSupGuid}`
    );
  }
}
