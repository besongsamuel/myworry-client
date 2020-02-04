import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AuditTrail } from '../models/audit-trail';
import { PageEvent } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  public user: User;

  constructor(private http: HttpClient, private authService: AuthService)
  {
    if(!authService.isTokenExpired())
    {
      this.getUser().subscribe((user : User) =>
      {
        this.user = user;
      });
    }
  }

  getUser() : Observable<User>
  {
    return this.http.get<User>(`${environment.ApiUrl}/users/me`, this.httpOptions);
  }

  createUser(user: any) : Observable<User>
  {
    return this.http.post<User>(`${environment.ApiUrl}users`, user, this.httpOptions);
  }

  updateUser(user: Partial<User>) : Observable<User>
  {
    return this.http.patch<User>(`${environment.ApiUrl}users/${user.id}`, user, this.httpOptions);
  }

  emailTaken(email: string) : Observable<any> {
    return this.http.get(`${environment.ApiUrl}/users/exists?filter[where][email]=${email}`, this.httpOptions);
  }

  getAuditTrails(userId: string, pageEvent: PageEvent): Observable<AuditTrail[]>
  {
    let myAuditFilter =
    {
      where: { userId: userId  }
    }

    if(pageEvent)
    {
      myAuditFilter["limit"] = pageEvent.length;
      myAuditFilter["offset"] = (pageEvent.pageIndex) * pageEvent.pageSize;
    }

    return this.http.get<AuditTrail[]>(`${environment.ApiUrl}audit-trails?filter=${JSON.stringify(myAuditFilter)}`, this.httpOptions);
  }

  getCount(id: string, service: string): Observable<any>
  {
    let myFilter =
    {
      where: { userId: id  }
    }

    return this.http.get<any>(`${environment.ApiUrl}${service}/count?filter=${JSON.stringify(myFilter)}`, this.httpOptions);
  }

  logout()
  {
    this.authService.logout();
    this.user = null;
  }


}
