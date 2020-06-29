import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { AuthService as SocialAuthService, SocialUser } from "angularx-social-login";
import {  GoogleLoginProvider } from "angularx-social-login";
import { environment } from 'src/environments/environment';
import { SNACKBAR_DURATION, SnackBarComponent } from './dialogs/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwPush } from '@angular/service-worker';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  title = 'myworry-client';

  environment : any = {}

  public locale: string = '';

  readonly VAPID_PUBLIC_KEY = "BCDCOsmD9KXtPbw7k_fwJ41yX7lDWCDJ51cYXLX4vEff_MwhfVayozaXR5Xj7oLaGEwvNYxeAv01udAW3K_KpX0";

  constructor(private socialAuthService : SocialAuthService, public authService: AuthService, public userService: UserService, private router: Router, private _snackBar: MatSnackBar,
    private swPush: SwPush){
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

    let redirectUrl = window.sessionStorage.getItem('redirectUrl');

    if(redirectUrl){

      window.sessionStorage.removeItem('redirectUrl');

      this.router.navigate([redirectUrl]);

    }
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

  subscribeToNotifications(){

    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    }).then((sub) => {
      this.userService.addPushSubscriber(sub).subscribe(sub => {
        this.userService.user.userSubscription = sub;
      })
    }).catch(err => console.error("Could not subscribe to notification", err));
  }

  unsubscribeToNotifications(){

  }

  logout()
  {
    this.userService.logout();
    this.router.navigate(['']);
    window.location.reload();
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
