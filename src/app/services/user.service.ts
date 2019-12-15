import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  user: User;
  
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

  logout()
  {
    this.authService.logout();
    this.user = null;
  }


}
