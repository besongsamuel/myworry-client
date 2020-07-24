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
import { ValidateDisplayNameNotTaken } from 'src/app/validators/async-displayname-not-taken.validator';
import { Title, Meta } from '@angular/platform-browser';


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
    private title: Title, meta: Meta)
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
    this.signupForm.controls['displayName'].setAsyncValidators(ValidateDisplayNameNotTaken.createValidator(this.userService));
    this.title.setTitle('Sign up to create and manage your worries and opinions.');
    meta.updateTag({ name: 'description', content: 'Sign up to MyWorry and start creating worries and opinions and interacting with other users. ' });
  }


onSubmit()
{
  if(this.signupForm.valid)
  {
    _.assign(this.user, _.omit(this.signupForm.value, ['confirmPassword']));

    this.userService.createUser(this.user).subscribe((user) =>
    {
      this.router.navigate(['/login', { email: this.user.email }]);
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
    }, (err) => {
      console.error('Could not remove image, ', err);
      this.user.image = "";
      this.profileImagePath =  "";
    });
  }

  imageSelected(files: File[]){

    if(files.length > 0){
      this.worryService.uploadImage(files[0], 'profile').subscribe((response) =>
        {
          this.user.image = response.imageName;
          this.profileImagePath =  `${environment.ApiUrl}uploads/images/tmp/${response.imageName}`;
        });
    }
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
