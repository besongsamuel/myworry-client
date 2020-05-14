import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { AuthService as SocialAuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { User } from './models/user';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  title = 'myworry-client';

  environment : any = {}

  constructor(private socialAuthService : SocialAuthService, public authService: AuthService, public userService: UserService, private router: Router){
    this.environment = environment;
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe(user => console.log(user));
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
