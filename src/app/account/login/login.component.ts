import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup(
  {
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  environment : any = {};
  error: string = null;
  newUserEmail: string = null;

  constructor(private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) { 

      this.environment = environment;

    }

  ngOnInit() {

    this.route.paramMap.subscribe((params) =>
    {
       this.newUserEmail = params.get('email');
    });

  }

  onSubmit()
  {
    this.authService.login(this.loginForm.value).subscribe((response : any) =>
    {
      this.error = null;

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
      this.error = err.error.message;
    });
  }

}
