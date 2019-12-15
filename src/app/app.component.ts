import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myworry-client';

  constructor(public authService: AuthService, public userService: UserService, private router: Router){}

  logout()
  {
    this.userService.logout();
    this.router.navigate(['']);
  }
}
