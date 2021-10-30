import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class QueryBuilderService {
  apiEndpoint = environment.gsApiUrl;
  private qbListAttrs = undefined;

  constructor(private http: HttpClient) { }

  public getQbListAttributes() {
    if (this.qbListAttrs) {
      const att = { ...this.qbListAttrs as object };
      this.qbListAttrs = undefined;
      return att;
    }
    return undefined;
  }

  public setQbListAttributes(obj: any) {
    this.qbListAttrs = obj;
  }

  public getMetaLanguagesWithUserPermission(): Observable<any> {
    return this.http.get<HttpResponse>(
      `${this.apiEndpoint}/metaLanguages/metaLangWithSec`
    );
  }

  public getSpaceswithMetaLanguages(metaSupGuid:string): Observable<any> {
    return this.http.get<HttpResponse>(
      `${this.apiEndpoint}/queryBuider/getSpacesWithMetaLang/${metaSupGuid}`
    );
  }

  public getTooList(tooType: string, metaSupGuid: string, spaceList: string[]): Observable<any> {
    return this.http.post<HttpResponse>(
      `${this.apiEndpoint}/queryBuider/getTooList/${tooType}`,
      {
        metaLangaugeId: metaSupGuid,
        spaceList: spaceList
      }
    );
  }

  public getNumberOfMetObj(metObjId: string) {
    return this.http.post<HttpResponse>(
      `${this.apiEndpoint}/queryBuider/getNumObjRelateToMetObj`,
      { supGuid: metObjId }
    );
  }

  public editQueryInBuild(qryId: string) {
    console.log('sent editQueryInBuild', qryId);
    return this.http.post<HttpResponse>(
      `${this.apiEndpoint}/queryBuider/getDataForRebuildQuery`,
      { qryGuid: qryId }
    );
  }

  public discardQuery(qryId: string) {
    console.log('sent discardQuery', qryId);
    return this.http.post<HttpResponse>(
      `${this.apiEndpoint}/queryBuider/discardQuery`,
      { qryGuid: qryId }
    );
  }

  public executeQuery(query: string) {
    return this.http.post<HttpResponse>(
      `${this.apiEndpoint}/queryBuider/executeQuery`,
      { encodedQuery: query }
    );
  }

  public getEndMetObjList(metObjId: string) {
    if (metObjId.includes(":")) {
      metObjId = metObjId.split(":")[0];
    }
    return this.http.post<HttpResponse>(
      `${this.apiEndpoint}/queryBuider/getEndMetObjList`,
      { supGuid: metObjId }
    );
  }

  public getPropertiesForMetObjEditMode(metObjId: string, metaLanSupGuid: string, qryGuid: string) {
    if (metObjId.includes(":")) {
      metObjId = metObjId.split(":")[0];
    }
    return this.http.post<HttpResponse>(
      `${this.apiEndpoint}/queryBuider/propertiesQBEditMode`,
      { metObjGuid: metObjId, metLangGuid: metaLanSupGuid, qryGuid: qryGuid }
    );
  }

  public getCountOfQueryResults(query: string) {
    return this.http.post<HttpResponse>(
      `${this.apiEndpoint}/queryBuider/getCountQuery`,
      { queryWithCount: query }
    );
  }

  public saveQuery(saveQry: string) {
    return this.http.post<HttpResponse>(
      `${this.apiEndpoint}/queryBuider/saveQuery`,
      saveQry
    );
  }

  public exportQBdataFunction(query: string, propTitleArry: string[], topicName: string, entityList: string[], exportType: string, mergeType: string, isIncludeIdentifier: boolean) {
    return this.http.post<HttpResponse>(
      `${this.apiEndpoint}/queryBuider/exportQBdata`,
      {
        query: query,
        propTitleArry: propTitleArry,
        topicName: topicName,
        entityList: entityList,
        exportType: exportType,
        mergeType: mergeType,
        isIncludeIdentifier: isIncludeIdentifier
      }
    );
  }
}
