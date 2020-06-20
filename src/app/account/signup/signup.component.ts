import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ValidateEmailNotTaken } from 'src/app/validators/async-email-not-taken.validator';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import * as _ from 'lodash'
import { environment } from 'src/environments/environment';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { User, SignupUser } from 'src/app/models/user';
import { Profile } from 'src/app/models/profile';
import { HelperService } from 'src/app/services/helper.service';
import { WorryService } from 'src/app/worry/services/worry.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {


  signupForm: FormGroup;
  profileImagePath: string;
  public fileDroped: NgxFileDropEntry;
  error: string = null;
  success: string = null;
  user: SignupUser = new SignupUser();
  environment;

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private worryService: WorryService,
    private helperService: HelperService)
  {
    this.environment = environment;
    this.signupForm = fb.group(
    {
      email: ['', [Validators.email, Validators.required]],
      givenName: ['', Validators.required],
      familyName: ['', Validators.required],
      password: ['', Validators.required],
      displayName: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    },{validator: this.checkIfMatchingPasswords('password', 'confirmPassword')});

    this.signupForm.controls['email'].setAsyncValidators(ValidateEmailNotTaken.createValidator(this.userService));

  }


onSubmit()
{
  if(this.signupForm.valid)
  {
    _.assign(this.user, _.omit(this.signupForm.value, ['confirmPassword']));

    this.userService.createUser(this.user).subscribe((user) =>
    {
      this.router.navigate(['/login', { email: user.email }]);
    }, (err) => {
      this.error = "SIGNUP_ERROR";
    });
  }
}

ngOnInit() {
}

removeImage()
  {
    this.worryService.deleteImage(this.user.image).subscribe(() =>
    {
      this.user.image = "";
      this.profileImagePath =  "";
    });
  }

fileDropped(files: NgxFileDropEntry[])
{
  this.fileDroped = files[0];

  if(this.fileDroped.fileEntry.isFile)
  {
    const fileEntry = this.fileDroped.fileEntry as FileSystemFileEntry;

    fileEntry.file((file: File) =>
    {
      this.worryService.uploadImage(file, 'profile').subscribe((response) =>
      {
        this.user.image = response.imageName;
        this.profileImagePath =  `${environment.ApiUrl}uploads/images/tmp/${response.imageName}`;
      });
    });
  }
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

}
