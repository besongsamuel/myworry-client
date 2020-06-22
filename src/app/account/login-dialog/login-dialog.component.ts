import { Component, OnInit, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {

  environment: any;

  loginForm = new FormGroup(
  {
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  error: string = null;

  constructor(private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<LoginDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public redirectUrl: string) { 
      window.sessionStorage.setItem('redirectUrl', redirectUrl);
    }

  ngOnInit(): void {

    this.environment = environment;

  }

  onSubmit()
  {

    this.dialogRef.close(this.loginForm.value);

    this.authService.login(this.loginForm.value).subscribe((response : any) =>
    {
      this.error = null;

      this.userService.getUser().subscribe((user: User) =>
      {
        this.userService.user = user;

        this.dialogRef.close(true);

      }, () => {});

    },
    err =>
    {
      this.error = err.error.message;
    });
  }

}
