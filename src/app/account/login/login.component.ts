import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
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
  previousURL: string;

  constructor(private authService: AuthService,
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
    },
    err =>
    {
      this.error = err.error.message;
    });
  }

}
