import { Injectable } from '@angular/core';
import { LoginCredentials } from '../login-credentials';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  login(credentials: LoginCredentials)
  {
    this.http.post(`${environment.ApiUrl}login`, credentials, this.httpOptions).subscribe((result) =>
    {
      console.log(result);
    })
  }

  logout()
  {

  }
}
