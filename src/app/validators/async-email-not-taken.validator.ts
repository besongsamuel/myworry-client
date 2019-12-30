import { AbstractControl } from '@angular/forms';
import { UserService } from '../services/user.service';
import { map } from 'rxjs/operators';

export class ValidateEmailNotTaken {
  static createValidator(userService: UserService) {
    return (control: AbstractControl) => {
      return userService.emailTaken(control.value);
    }
  }
}