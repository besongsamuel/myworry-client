import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { LoginCredentials } from '../login-credentials';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { throwError, Observable, ReplaySubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../models/user';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  public user: User;

  public token: string;

  public provider: string = 'myworry';

  public loggedIn: boolean;

  public redirectUrl: string = null;

  public login$ = new ReplaySubject();

  constructor(private http: HttpClient, public dialog: MatDialog, private route: ActivatedRoute, private router: Router,
    @Inject(PLATFORM_ID) private platformId: any)
  {
    
  }

  getUser() : Observable<User>
  {
    return this.http.get<User>(`${environment.ApiUrl}users/me`, this.httpOptions);
  }

  attemptLogin(){

      if(!this.isTokenExpired())
      {
        this.token = this.getToken();
        this.getUser().subscribe((user : User) =>
        {
          this.user = user;
          this.loggedIn = true;
          const decoded = jwt_decode(this.token);
          user.email = decoded.email;
          user.userIdentity = decoded.userIdentity;
          this.login$.next(user);
          
        });
      }
      
  }

  login(credentials: LoginCredentials)
  {
    return this.http.post(`${environment.ApiUrl}users/login`, credentials, this.httpOptions)
    .pipe(
      catchError(this.handleError),
      tap((x: any) =>
      {
        this.setToken(x.token);
        this.attemptLogin();
      })
    );
  }


  facebookLogin(redirectUrl?: string)
  {
    return this.http.get(`${environment.ApiUrl}auth/thirdparty/facebook${redirectUrl ? `?redirecturl=${redirectUrl}` : ''}`, this.httpOptions).pipe(
      catchError(this.handleError),
      tap((x: any) =>
      {
        if (isPlatformBrowser(this.platformId)){
          window.sessionStorage.setItem('token', x.token);
        }
        
        this.token = x.token;
        this.loggedIn = true;
      })
    );
  }

  logout()
  {
    this.loggedIn = false;
    if (isPlatformBrowser(this.platformId)){
      window.sessionStorage.removeItem('token');
    }
    

  }

  getToken(): string {
    if (isPlatformBrowser(this.platformId)){
      return window.sessionStorage.getItem('token');
    }
    else
    return '';
  }

  setProvider(provider: string){
    this.provider = provider;
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)){
      window.sessionStorage.setItem('token', token);
    }

    if(!this.isTokenExpired())
    {
      this.token = token;
    }

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
      console.error('An error occurred:', error.error ? error.error.message : error.error);
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
