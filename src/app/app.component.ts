import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
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

  constructor(private socialAuthService : SocialAuthService, public authService: AuthService, public userService: UserService, private router: Router, private _snackBar: MatSnackBar){
    this.environment = environment;

    this.locale = window.sessionStorage.getItem('locale');

    if(!this.locale){
      this.locale = 'en-US';
      window.sessionStorage.setItem('locale', 'en-US');

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
    window.location.reload();
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
