import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces/user.type';
import { API_BASE_ROUTE } from '../share/constants';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) { }
  whitelistEmail(newUserEmail: string) {
    return this.http.post(API_BASE_ROUTE + '/auth/whitelist', { email: newUserEmail });
  }
  getWhitelistedEmails(): Observable<{ data: string[] }> {
    return this.http.get<{ data: string[] }>(API_BASE_ROUTE + '/auth/whitelist');
  }
  deleteUser(id: string) {
    return this.http.delete(API_BASE_ROUTE + '/users/' + id);
  }
  updateUser(selectedUser: IUser) {
    return this.http.put(API_BASE_ROUTE + '/users/' + selectedUser._id, selectedUser);
  }

  getAllUsers(): Observable<{ data: IUser[] }> {
    return this.http.get<{ data: IUser[] }>(API_BASE_ROUTE + '/users/');
  }

}
