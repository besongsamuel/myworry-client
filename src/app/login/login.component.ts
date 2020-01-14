import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
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
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  error: boolean = false;
  errorMessage: string = '';
  newUserEmail: string = null;

  constructor(private authService: AuthService, 
    private userService: UserService, 
    private router: Router,
    private route: ActivatedRoute) { }

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
