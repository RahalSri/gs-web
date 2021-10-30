import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from 'src/app/shared/model/role';
import { HttpResponse } from 'src/app/shared/model/http-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private currentRole!: Role;
  apiEndpoint = environment.gsApiUrl;

  constructor(private http: HttpClient) {}

  setCurrentRole(role: Role): void {
    this.currentRole = role;
  }

  getCurrentRole(): Role {
    return this.currentRole;
  }

  fetchAllRoles(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${this.apiEndpoint}/role/roles`);
  }

  saveRole(role: Role): Observable<HttpResponse> {
    const roleRequest = this.createRoleRequestBody(role);
    return this.http.post<HttpResponse>(
      `${this.apiEndpoint}/role/role`,
      roleRequest
    );
  }

  editRole(role: Role): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${this.apiEndpoint}/role/role`, role);
  }

  deleteRole(role: Role): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(
      `${this.apiEndpoint}/role/role/` + role.supGuId
    );
  }
  getActiveRoles(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${this.apiEndpoint}/role/activeroles`);
  }

  getSpacesForRoles(roles: Role[]): Observable<any> {
    return this.http.get<any>(
      `${this.apiEndpoint}/users/accessibleSpaces`
    );
  }

  createRoleRequestBody(role: Role): any {
    return {
      roleName: role.roleName,
      description: role.description,
      serId: role.serId,
      active: role.active,
      isInstanceManager: role.isInstanceManager,
      isSupportAnalyst: role.isSupportAnalyst,
      isSecurityManager: role.isSecurityManager,
      isPublicationAdmin: role.isPublicationAdmin,
      isProfessional: role.isProfessional
    };
  }
}
