import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AuditTrail } from '../models/audit-trail';

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

  getAuditTrails(): Observable<AuditTrail[]>
  {
    let myAuditFilter = 
    {
      where: { userId: this.user.id  }
    }

    return this.http.get<AuditTrail[]>(`${environment.ApiUrl}audit-trails?filter=${JSON.stringify(myAuditFilter)}`, this.httpOptions);
  }

  logout()
  {
    this.authService.logout();
    this.user = null;
  }


}
