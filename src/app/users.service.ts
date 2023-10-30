import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE = 'http://localhost:3000/api/users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get<any>(BASE);
  }

  addUser(user: any): Observable<any> {
    return this.http.post(BASE, user);
  }

  updateUser(id: number, user: any): Observable<any> {
    const url = `${BASE}/${id}`;
    return this.http.put(url, user);
  }



  deleteUser(userId: number): Observable<any> {
    const url = `${BASE}/${userId}`;
    return this.http.delete(url);
  }
}
