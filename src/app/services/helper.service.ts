import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Opinion } from '../models/opinion';
import { Reply } from '../models/reply';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  async createFile(url: string) : Promise<File> {
    let response = await fetch(url);
    let data = await response.blob();
    let metadata = {
      type: 'image/png'
    };
    return new File([data], "image.png", metadata);
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

  getOpnionReplies(opinion: Opinion): Reply[]{


    if(!opinion.replies){
      return [];
    }

    return opinion.replies.filter(x => !x.replyId);
  }

  getUserReplies(opinion: Opinion, reply: Reply): Reply[]{

    if(!opinion.replies){
      return [];
    }
    
    return opinion.replies.filter(x => x.replyId == reply.id);
  }
  
}
