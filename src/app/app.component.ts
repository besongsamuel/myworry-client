import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService as SocialAuthService, SocialUser } from "angularx-social-login";
import {  GoogleLoginProvider } from "angularx-social-login";
import { environment } from 'src/environments/environment';
import { SNACKBAR_DURATION, SnackBarComponent } from './dialogs/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  title = 'myworry-client';

  environment : any = {}

  public locale: string = '';


  constructor(private socialAuthService : SocialAuthService, public authService: AuthService, public userService: UserService, private router: Router, private route: ActivatedRoute, private _snackBar: MatSnackBar){

    this.environment = environment;

    this.locale = window.sessionStorage.getItem('locale');

    if(!this.locale){

      let browserLang = navigator.language;

      if(browserLang.startsWith('fr')){

        this.locale = 'fr';
      }
      else{
        this.locale = 'en-US';
      }

      window.sessionStorage.setItem('locale', this.locale);

      /** TODO: RESOLVE LANGUAGE CHANGE */
      this.locale = 'en-US';

    }

  }
  ngOnInit(): void {

    this.authService.attemptLogin();

    this.authService.login$.subscribe(() => {

      let redirectUrl = sessionStorage.getItem('redirectUrl');

        if(redirectUrl){
          sessionStorage.removeItem('redirectUrl');
          this.router.navigate([redirectUrl]);
        }
    });

    this.route.queryParams.subscribe(params => {

      if(params['token']){
        this.authService.setToken(params['token']);
        this.authService.attemptLogin();
      }
    });

  }

  resendActivationEmail(){
    this.userService.sendActivationEmail(this.userService.user.email).subscribe((result) => {
      if(result){
        this._snackBar.openFromComponent(SnackBarComponent, { duration: SNACKBAR_DURATION, data: { message: "Email Sent", error: false } })

      }
    }, (err) => {
      this._snackBar.openFromComponent(SnackBarComponent, { duration: SNACKBAR_DURATION, data: { message: err.error.error.message, error: true } })

    });
  }

  setLocale(locale: string){
    window.sessionStorage.setItem('locale', locale);

    this.router.url;
    
    //if(locale == 'fr'){
    //  window.location.href = `${environment.domain.replace('www', 'fr')}${this.router.url}`;
    //}
    //else{
    //  window.location.href = `${environment.domain}${this.router.url}`;
    //}

    this.locale = locale;
  }

  logout()
  {
    this.userService.logout();
    this.router.navigate(['']);
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
 
  signInWithFB(): void {
    this.authService.facebookLogin().subscribe(x => console.log(x), (err) => console.error(err));
  } 
 
  signOut(): void {
    this.socialAuthService.signOut();
  }
}
