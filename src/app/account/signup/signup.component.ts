import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ValidateEmailNotTaken } from 'src/app/validators/async-email-not-taken.validator';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import * as _ from 'lodash'
import { WorryService } from 'src/app/services/worry.service';
import { environment } from 'src/environments/environment';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { User } from 'src/app/models/user';
import { Profile } from 'src/app/models/profile';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {


  signupForm: FormGroup;
  imageName: string;
  profileImagePath: string;
  public fileDroped: NgxFileDropEntry;

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private worryService: WorryService)
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
    var user: User = new User();
    user.profile = new Profile();

    if(this.imageName)
    {
      user.profile.image = this.imageName;
    }

    _.assign(user, _.omit(this.signupForm.value, ['confirmPassword']));

    this.userService.createUser(user).subscribe((user) =>
    {
      this.router.navigate(['/login', { email: user.email }]);
    });
  }
}

ngOnInit() {
}

removeImage()
  {
    this.worryService.deleteImage(this.imageName).subscribe(() =>
    {
      this.imageName = "";
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
          this.imageName = response.imagePath;
          this.profileImagePath =  `${environment.ApiUrl}uploads/tmp/images/${response.imagePath}`;
        });
      });
    }
  }

}
