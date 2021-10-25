import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgreementData } from '../../shared/model/AgreementData';
import { User } from '../../shared/model/user';
import { environment} from "../../../environments/environment";
import { HttpResponse } from 'src/app/shared/model/http-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUser!: User;

  constructor(private http: HttpClient) {}

  apiEndpoint = environment.gsApiUrl;

  setCurrentUser(user: User): void {
    this.currentUser = user;
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  fetchAllUsers(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${this.apiEndpoint}/users`);
  }

  deleteUser(user: User): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(
      `${this.apiEndpoint}/users/` + user.supGuId
    );
  }

  editUser(user: User): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${this.apiEndpoint}/users`, user);
  }

  updateProfile(user: User): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(
      `${this.apiEndpoint}/users/profile`,
      user
    );
  }

  addUser(user: User): Observable<HttpResponse> {
    const request = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      defaultSpaceId: user.defaultSpaceId,
      active: user.active,
      roles: user.roles
    };
    return this.http.post<HttpResponse>(`${this.apiEndpoint}/users`, request);
  }

  getDefaultSpace(user: User): Observable<any> {
    const requestBody = { supGuId: user.supGuId };
    return this.http.post<any>(
      `${this.apiEndpoint}/users/getDefSpaceByUser`,
      requestBody
    );
  }

  getLoggedUser(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${this.apiEndpoint}/users/loggedUser`);
  }

  loadUserRoleLicenceDataToTable(
    selectedOrgId: number
  ): Observable<AgreementData> {
    return this.http.post<AgreementData>(
      `${this.apiEndpoint}/users/userLicence`,
      {
        orgOrganisationId: `${selectedOrgId}`
      }
    );
  }

  getSpacesForRoles(): Observable<any> {
    return this.http.get<any>(
      `${this.apiEndpoint}/users/accessibleSpaces`
    );
  }
}
