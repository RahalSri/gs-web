import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { Space } from "src/app/shared/model/space";
import { MetView } from "src/app/shared/model/met-view";
import { DataObject } from "src/app/shared/model/data-object";
import { View } from "src/app/shared/model/view";
import { MediaFile } from "src/app/shared/model/media-file";
import { Category } from "src/app/shared/model/category";
import { HttpResponse } from "src/app/shared/model/http-response";

@Injectable({
  providedIn: 'root',
})
export class CatalogueService {
  apiEndpoint = environment.gsApiUrl;

  constructor(private http: HttpClient) { }

  getLibSpacesByUser() {
    return this.http.get<Space[]>(`${this.apiEndpoint}/catalog/libSpaces`);
  }

  getSpaceByGuId(supGuId: string) {
    return this.http.post<Space>(`${this.apiEndpoint}/catalog/space`, {
      supGuid: supGuId
    });
  }

  getDefaultDataSheet(datObjSupGuId: string) {
    return this.http.post<any>(
      `${this.apiEndpoint}/datObject/getDefaultDatsheetDataByObj`,
      {
        supGuId: datObjSupGuId
      }
    );
  }

  fetchAllLibraryList(organizationId: string) {
    return this.http.post<HttpResponse>(
      `${this.apiEndpoint}/library/libListForOrg`,
      {
        orgOrganisationId: organizationId
      }
    );
  }

  fetchSpacesByLibrary(organizationId: string, supGuid: string) {
    return this.http.post<HttpResponse>(
      `${this.apiEndpoint}/catalog/getSpacesByLibGuid`,
      {
        organisationId: organizationId,
        supGuid: supGuid
      }
    );
  }

  fetchViewsBySpaceWithAccess(spaceGuid: string, roleGuid: string) {
    return this.http.get<any[]>(
      `${this.apiEndpoint}/datView/getViewsBySpaceWithAccess/${spaceGuid}/${roleGuid}`
    );
  }

  saveViewAccess(viewAccess: any) {
    return this.http.post<HttpResponse>(
      `${this.apiEndpoint}/datView/saveViewAccessdata`,
      viewAccess
    );
  }

  fetchMetViewByView(viewGuid: string) {
    return this.http.post<MetView>(
      `${this.apiEndpoint}/metaViews/getMetViewByView`,
      {
        viewGuid: viewGuid
      }
    );
  }

  deleteView(viewGuid:string, metViewCat: string, qryId:any) {
    return this.http.post<HttpResponse>(
      `${this.apiEndpoint}/datView/deleteView`,
      {
        viewGuid: viewGuid,
        metViewCategory: metViewCat,
        queryGuid: qryId
      }
    );
  }

  getOrganization(orgId: number): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      `${this.apiEndpoint}/catalog/getOrganization`,
      {
        orgOrganisationId: orgId
      }
    );
  }

  updateSessionTimeOutOrg(timeout: number): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      `${this.apiEndpoint}/catalog/updateSessionTime`,
      {
        orgDefaultTimeouPeriod: timeout
      }
    );
  }

  loadAllOrganizations(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(
      `${this.apiEndpoint}/catalog/getAllOrganizations`
    );
  }

  fetchViewCategories() {
    return this.http.get<Array<Category>>(
      `${this.apiEndpoint}/catalog/getViewCategories`
    );
  }

  fetchMetViewByCategory(supGuid: string, categoryGuid: string) {
    return this.http.get<any[]>(
      `${this.apiEndpoint}/metaViews/getMetViewDataByCategory?spaceId=${supGuid}&viewCategoryGuid=${categoryGuid}`
    );
  }

  fetchMetTypeOfObject(supGuid: string) {
    return this.http.get<Array<MetView>>(
      `${this.apiEndpoint}/metaObjects/getMetObjByMetView?metViewGuid=${supGuid}`
    );
  }

  fetchMetTypeOfObjectForMediaViews(supGuid: string) {
    return this.http.get<any[]>(
      `${this.apiEndpoint}/metaObjects/getMetObjByMetaLangSpace?spaceGuid=${supGuid}`
    );
  }

  fetchDatObjByMetObj(metObjGuid: string, spaceGuid:string, searchObj:string) {
    return this.http.get<Array<DataObject>>(
      `${this.apiEndpoint}/metaObjects/getDatObjectsByTypeOfObj?metObjGuid=${metObjGuid}&spaceGuid=${spaceGuid}&searchObj=${searchObj}`
    );
  }

  fetchViewAccessBySpace(spaceGuid: string) {
    return this.http.get<any[]>(
      `${this.apiEndpoint}/datView/getViewAccessBySpace/${spaceGuid}`
    );
  }

  copyViewPermissionToNewView(
    newViewGuid: string,
    roleGuidList: any[]
  ): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      `${this.apiEndpoint}/datView/copyViewPermissionToNewView`,
      {
        newViewGuid: newViewGuid,
        roleGuidList: roleGuidList
      }
    );
  }

  fetchViewsBySpace(space: Space): Observable<any[]> {
    return this.http.post<Array<View>>(
      `${this.apiEndpoint}/datView/getViewsBySpace`,
      {
        supGuid: space.supGuid
      }
    );
  }

  fetchMediaViewdataForViewMgt(supGuid: string) {
    return this.http.get<MediaFile>(
      `${this.apiEndpoint}/datView/getMediaViewdataForViewMgt/${supGuid}`
    );
  }

  fetchSubObjData(viewGuid: string) {
    return this.http.get<DataObject>(
      `${this.apiEndpoint}/datView/getSubObjDataByView?viewGuid=${viewGuid}`
    );
  }

  removeTileImage(mediaFilePath: string, mediaFileName: string, datViewSupGuId: string) {
    return this.http.post<HttpResponse>(
      `${this.apiEndpoint}/datView/removeImageFromTile`,
      {
        downlaodFilePath: mediaFilePath,
        filename: mediaFileName,
        viewSupguId: datViewSupGuId
      }
    );
  }

  getViewCategory(viewSupGuId: string) {
    return this.http.get<HttpResponse>(
      `${this.apiEndpoint}/datView/getViewCategory/${viewSupGuId}`);
  }

  getPropertyList(datObjSupGuId: string, spaceGuid: string, defDatasheetGuid: string, displayType: string) {
    return this.http.post<any>(
      `${this.apiEndpoint}/datObject/properties/${displayType}`,
      {
        supGuId: datObjSupGuId,
        spaceSupGuId: spaceGuid,
        defaultDatasheetSupguId: defDatasheetGuid
      }
    );
  }

  getDataForRelatedObjectsBySwitch(guIdArray: any, switchLable:string, spcGuid: string) {
    return this.http.post<any>(
      `${this.apiEndpoint}/datObject/dataForSwitch/${switchLable}`,
      {
        objSupGuIdArray: guIdArray,
        spcGuid: spcGuid
      }
    );
  }

  fetchAlternateViews(spaceSupId:string, viewSupId:string, objSupId:string) {
    return this.http.get<any[]>(
      `${this.apiEndpoint}/datView/getAlternativeViews/${spaceSupId}/${viewSupId}/${objSupId}`
    );
  }

  fetchMediaViewData(viewId:string) {
    return this.http.get<any>(
      `${this.apiEndpoint}/datView/getMediaView/${viewId}`);
  }

  fetchTableViewData(spaceSupId:string, skipNo:any) {
    return this.http.get<any>(
      `${this.apiEndpoint}/datView/getTableView/${spaceSupId}/${skipNo}`);
  }

  fetchTableViewFilteredData(filteredData: any) {
    return this.http.post<any>(
      `${this.apiEndpoint}/datView/getFilteredDataForTableView`,
      filteredData
    );
  }

  fetchGraphAlternateViews(spaceSupId:string, viewSupId:string, objSupId:string) {
    return this.http.get<any>(
      `${this.apiEndpoint}/datView/getNavigationViews/${spaceSupId}/${viewSupId}/${objSupId}`);
  }

  fetchListViewData(spaceSupId:string, viewId:string, paginationFilterData: any) {
    if (paginationFilterData == null) {
      paginationFilterData = {
        skipItems: 0,
        pageSize: 20
      }
    }

    var endpoint = `${this.apiEndpoint}/datView/getListView/${spaceSupId}/${viewId}?pageNo=${paginationFilterData.skipItems}&pageSize=${paginationFilterData.pageSize}`;
    if (paginationFilterData.title) {
      endpoint = endpoint + `&title=${paginationFilterData.title}`;
    }
    if (paginationFilterData.id) {
      endpoint = endpoint + `&id=${paginationFilterData.id}`;
    }
    if (paginationFilterData.desc) {
      endpoint = endpoint + `&desc=${paginationFilterData.desc}`;
    }

    return this.http.get<any>(endpoint);
  }

  getHierarchyByID(spaceSupId: string, objSupId:string) {
    return this.http.get<any>(
      `${this.apiEndpoint}/datView/getHierarchyView/${spaceSupId}/${objSupId}`);
  }
}
