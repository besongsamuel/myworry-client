import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User, SignupUser } from '../models/user';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AuditTrail } from '../models/audit-trail';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    }),
    withCredentials: true
  };

  public user: User;

  constructor(private http: HttpClient, public authService: AuthService, private route: ActivatedRoute)
  {
    if(!authService.isTokenExpired())
    {
      this.getUser().subscribe((user : User) =>
      {
        this.user = user;
      });
    }

    this.route.queryParams.subscribe(params => {
      if(params['token']){
        this.authService.setToken(params['token'])
        this.getUser().subscribe((user : User) =>
        {
          this.user = user;
        });

        if(params['provider']){
          this.authService.setProvider(params['provider']);
        }
      }

      
  });

    
  }

  refreshUser() : Observable<User>{

    let getUser$ = this.getUser();

    getUser$.subscribe((user : User) =>
    {
      this.user = user;
    });

    return getUser$;
  }

  getUser() : Observable<User>
  {
    return this.http.get<User>(`${environment.ApiUrl}users/me`, this.httpOptions);
  }

  sendActivationEmail(email: string) : Observable<boolean>{
    return this.http.get<boolean>(`${environment.ApiUrl}users/send-activation-email?email=${email}`, this.httpOptions);

  }

  activateAccount(token: string) : Observable<boolean>
  {
    return this.http.get<boolean>(`${environment.ApiUrl}users/activate-account?activation-token=${token}`, this.httpOptions);
  }

  createUser(user: SignupUser) : Observable<User>
  {
    return this.http.post<User>(`${environment.ApiUrl}users`, user, this.httpOptions);
  }

  patchUserIdentity(userIdentityProfile: any) : Observable<User>
  {
    return this.http.patch<any>(`${environment.ApiUrl}user-identity`, userIdentityProfile, this.httpOptions);
  }

  getUsers(filter: string) : Observable<User[]>
  {
    if(!filter){
      filter = '';
    }
    return this.http.get<User[]>(`${environment.ApiUrl}users?name=${filter}`, this.httpOptions);
  }

  emailTaken(email: string) : Observable<any> {
    return this.http.get(`${environment.ApiUrl}users/exists?filter[where][email]=${email}`, this.httpOptions);
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

  getProfileImage(user: User){

      let profile = this.getProfile(user);

      return profile.profileImage;
  }

  getProfile(user: User) {

    if(user.userIdentity){
      return user.userIdentity.profile;
    }

    return null;
  }

  getUserIdentity(user: User){

    return user.userIdentity;
  }

  generateFormControlData(data, result = {}){

    Object.keys(data).forEach(key => {

      if(typeof data[key] != 'object'){

        result[key] = [data[key]];
      }
      else{

        result[key] = this.generateFormControlData(data[key], {})
      }

    });

    return result;

  }


}
