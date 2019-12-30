import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
}
