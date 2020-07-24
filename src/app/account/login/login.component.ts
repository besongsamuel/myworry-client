import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { Title, Meta } from '@angular/platform-browser';

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
    private route: ActivatedRoute,
    private title: Title, meta: Meta) { 

      this.environment = environment;

      this.title.setTitle('Sign In to view, edit and manage your worries and opinions.');
      meta.updateTag({ name: 'description', content: 'Signing into MyWorry opens the way for you to create and interact with worries created by other users. You can also access and manage your content. ' })

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
