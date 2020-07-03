import { AbstractControl } from '@angular/forms';
import { UserService } from '../services/user.service';
import { map } from 'rxjs/operators';

export class ValidateDisplayNameNotTaken {
  static createValidator(userService: UserService) {
    return (control: AbstractControl) => {
      return userService.taken('displayName', control.value);
    }
  }
}