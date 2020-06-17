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
  activationEmailNotSent: boolean = false;
  loading: boolean = false;
  activationEmailNotSentMessage: string | null = null;
  activationErrorMessage: string | null = null;

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
    this.activationEmailNotSent = false;
    this.loading = false;
    this.activationEmailNotSentMessage  = null;
    this.activationErrorMessage = null;
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

        switch(errorCode){
          case 'TOKEN_INVALID':
            this.activationErrorMessage = 'The activation token is invalid.';
            break;
          case 'TOKEN_EXPIRED':
            this.activationErrorMessage = 'The activation token has expired.';
            break;
        }

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

        switch(errorCode){
          case 'EMAIL_ALREADY_VERIFIED':
            this.activationEmailNotSentMessage = 'The email provided is already verified.';
            break;
          case 'EMAIL_NOT_FOUND':
            this.activationEmailNotSentMessage = 'The email entered was not found.';
            break;
        }

      
      this.activationFailure = true;
      this.loading = false;
    });
  }

}
