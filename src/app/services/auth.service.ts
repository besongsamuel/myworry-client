import { Injectable } from '@angular/core';
import { LoginCredentials } from '../login-credentials';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import { UserService } from './user.service';
import { User } from '../models/user';
import { SocialUser } from 'angularx-social-login';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };



  public token: string;

  public loggedIn: boolean;

  public redirectUrl: string = null;

  constructor(private http: HttpClient)
  {
    if(!this.isTokenExpired())
    {
      this.token = this.getToken();
      this.loggedIn = true;
    }
  }

  login(credentials: LoginCredentials)
  {
    return this.http.post(`${environment.ApiUrl}users/login`, credentials, this.httpOptions)
    .pipe(
      catchError(this.handleError),
      tap((x: any) =>
      {
        sessionStorage.setItem('token', x.token);
        this.token = x.token;
        this.loggedIn = true;
      })
    );
  }

  facebookLogin(credentials: SocialUser)
  {
    return this.http.post<User>(`${environment.ApiUrl}users/facebook-login`, credentials, this.httpOptions).pipe(
      catchError(this.handleError),
      tap((x: any) =>
      {
        sessionStorage.setItem('token', x.token);
        this.token = x.token;
        this.loggedIn = true;
      })
    );
  }

  logout()
  {
    this.loggedIn = false;
    sessionStorage.removeItem('token');

  }

  getToken(): string {
    return sessionStorage.getItem('token');
  }

  setToken(token: string): void {
    sessionStorage.setItem('token', token);
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    if(!token) token = this.getToken();
    if(!token) return true;

    const date = this.getTokenExpirationDate(token);
    if(date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(error.error);
  };
}
