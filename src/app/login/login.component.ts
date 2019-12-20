import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup(
  {
    email: new FormControl(''),
    password: new FormControl('')
  });

  error: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit()
  {
    this.authService.login(this.loginForm.value).subscribe((response : any) =>
    {
      this.error = false;

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

    },
    err =>
    {
      this.error = true;
      this.errorMessage = err.error.message;

    });
  }

}
