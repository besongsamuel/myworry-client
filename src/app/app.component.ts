import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { AuthService as SocialAuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  title = 'myworry-client';

  constructor(private socialAuthService : SocialAuthService, public authService: AuthService, public userService: UserService, private router: Router){}

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((socialUser : SocialUser) => {
      
      if(socialUser)
      {
        this.authService.facebookLogin(socialUser).subscribe(_ => {
          
          this.userService.getUser().subscribe((user: User) =>
          {
            this.userService.user = user;

            if(this.authService.redirectUrl)
            {
              this.router.navigate([this.authService.redirectUrl]);
            }
            else
            {
              this.router.navigate(['']);
            }

          }, () => {});

        });
      }
      
    });
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
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  } 
 
  signOut(): void {
    this.socialAuthService.signOut();
  }
}
