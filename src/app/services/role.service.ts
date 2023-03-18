import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRole } from '../interfaces/role.type';
import { API_BASE_ROUTE } from '../share/constants';

@Injectable()
export class RoleService {
  updateRole(role: IRole) {
    return this.http.post(API_BASE_ROUTE + '/role/update', role);
  }
  createRole(role: IRole) {
    console.log(role);
    return this.http.post(API_BASE_ROUTE + '/role/', role);
  }
  getPermissions() {
    return this.http.get<string[]>(API_BASE_ROUTE + '/permission/');
  }
  constructor(private http: HttpClient) {}

  getAllRoles(): Observable<IRole[]> {
    return this.http.get<IRole[]>(API_BASE_ROUTE + '/role/');
  }
}
