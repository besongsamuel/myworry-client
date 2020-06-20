import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.scss']
})
export class ActivateAccountComponent implements OnInit {

  activationFailure: boolean =  false;
  activationSuccess: boolean =  false;
  activationEmailSent: boolean = false;
  loading: boolean = false;
  activationEmailNotSent: string | null = null;
  activationError: string | null = null;

  resendActivationForm = new FormGroup(
  {
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(private route: ActivatedRoute,
    private router: Router, private userService: UserService) { }

  resetErrors(){
    this.activationFailure =  false;
    this.activationSuccess =  false;
    this.activationEmailSent = false;
    this.loading = false;
    this.activationEmailNotSent  = null;
    this.activationError = null;
  }

  ngOnInit(): void {

    let token = this.route.snapshot.queryParams.activate_token;

    if(token){

      this.loading = true;
      this.userService.activateAccount(token).subscribe((result: boolean) => {
        this.resetErrors();
        this.activationSuccess = true;
      }, (err: any) => {

        this.resetErrors();

        let errorCode = err.error.error.message;

        this.activationError = errorCode;

        this.activationFailure = true;
      });

    }
    else{
      this.loading = false;
      this.activationFailure = true;
    }

  }

  onResendActivation(){

    this.loading = true;

    this.userService.sendActivationEmail(this.resendActivationForm.value.email).subscribe(() => {

      this.resetErrors();
      this.activationFailure = true;
      this.activationEmailSent = true;
      this.loading = false;

    }, (err : any) => {

      this.resetErrors();
      let errorCode = err.error.error.message;

      this.activationEmailNotSent = errorCode;
      
      this.activationFailure = true;
      this.loading = false;
    });
  }

}
