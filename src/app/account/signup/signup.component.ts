import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ValidateEmailNotTaken } from 'src/app/validators/async-email-not-taken.validator';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import * as _ from 'lodash'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {


  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router,) 
  {
    this.signupForm = fb.group(
    {
      email: ['', [Validators.email, Validators.required]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      displayName: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    },{validator: this.checkIfMatchingPasswords('password', 'confirmPassword')});

    this.signupForm.controls['email'].setAsyncValidators(ValidateEmailNotTaken.createValidator(this.userService));

  }


checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
  return (group: FormGroup) => {
    let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
    if (passwordInput.value !== passwordConfirmationInput.value) {
      return passwordConfirmationInput.setErrors({notEquivalent: true})
    }
    else {
        return passwordConfirmationInput.setErrors(null);
    }
  }
}

onSubmit()
{
  if(this.signupForm.valid)
  {
    this.userService.createUser(_.omit(this.signupForm.value, ['confirmPassword']) ).subscribe((user) => 
    {
      this.router.navigate(['/login', { email: user.email }]);
    });
  }
}

ngOnInit() {
}

}
