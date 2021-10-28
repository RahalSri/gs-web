import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpResponse } from 'src/app/shared/model/http-response';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  apiEndpoint = environment.gsApiUrl;

  constructor(private http: HttpClient) {}

  getFileList(orgId: number, lib: any, spc: any, mediatype: any): Observable<HttpResponse> {
    const libSupid = '';
    const spcSupId = '';
    let libGuid = '';
    let spcGuid = '';
    let libTitle = '';
    let spcTitle = '';

    if (lib != null && lib !== '') {
      libGuid =
        lib.supGuid !== null && lib.supGuid !== 'undefined' ? lib.supGuid : '';
      libTitle =
        lib.title !== null && lib.title !== 'undefined' ? lib.title : '';
    }
    if (spc != null && spc !== '') {
      spcGuid =
        spc.supGuid !== null && spc.supGuid !== 'undefined' ? spc.supGuid : '';
      spcTitle =
        spc.title !== null && spc.title !== 'undefined' ? spc.title : '';
    }

    return this.http.post<HttpResponse>(
      `${this.apiEndpoint}/fileUploads/downloadMedia`,
      {
        organizationId: orgId,
        libGuid: libGuid,
        spcGuid: spcGuid,
        libTitle: libTitle,
        spcTitle: spcTitle,
        mediaType: mediatype
      }
    );
  }

  getPropertiesForMedia(orgId: any, filepath: any) {
    return this.http.post<HttpResponse>(
      `${this.apiEndpoint}/fileUploads/getPropertiesOfMedia`,
      {
        organizationId: orgId,
        downlaodFilePath: filepath
      }
    );
  }

  deleteFile(orgId: any, libGuid: any, spcGuid: any, mediaType: any, filepath: any) {
    return this.http.post<HttpResponse>(
      `${this.apiEndpoint}/fileUploads/deleteMedia`,
      {
        organizationId: orgId,
        mediaType: mediaType,
        downlaodFilePath: filepath,
        libGuid: libGuid,
        spcGuid: spcGuid
      }
    );
  }

  uploadMedia(file: File, selectedDataModel: any){
    var formData = new FormData();
    formData.append('system', selectedDataModel.system);
		formData.append('orgId', selectedDataModel.orgId);
		formData.append('libSupGuid', selectedDataModel.libSupGuid);
		formData.append('libTitle', selectedDataModel.libTitle);
		formData.append('spcSupGuid', selectedDataModel.spcSupGuid);
		formData.append('spcTitle', selectedDataModel.spcTitle);
		formData.append('mediaType', selectedDataModel.mediaType);
		formData.append('currentFile', selectedDataModel.currentFile);

    formData.append("uploadfile", file);
    return this.http.post(`${this.apiEndpoint}/fileUploads/uploadMedia`, formData);
  }

    uploadMediaProperty(file: File, uploadData: any){
        var formData = new FormData();
        formData.append('spaceTitle', uploadData.spaceTitle);
        formData.append('spaceGuid', uploadData.spaceGuid);
        formData.append('libTitle', uploadData.libTitle);
        formData.append('libGuid', uploadData.libGuid);
        formData.append('objectGuid', uploadData.objectGuid);
        formData.append('mediaPropId', uploadData.mediaPropId);
        formData.append('fileName', uploadData.fileName);

        formData.append("mediaProperty", file);
        return this.http.post<HttpResponse>(`${this.apiEndpoint}/fileUploads/uploadMediaProperty`, formData);
    }

    deleteMediaProperty(objectId: any) {
        return this.http.post<HttpResponse>(
            `${this.apiEndpoint}/fileUploads/deleteMediaProperty`,
            {
                objectGuid: objectId
            }
        );
    }
}
