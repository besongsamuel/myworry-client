import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Worry } from '../models/worry';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class WorryService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  
  constructor(private http: HttpClient) { }

  getWorries() : Observable<Worry[]>
  {
    return this.http.get<Worry[]>(`${environment.ApiUrl}/worries?filter[include][][relation]=user`, this.httpOptions);
  }

  createWorry(worry: Worry) : Observable<Worry>
  {
    return this.http.post<Worry>(`${environment.ApiUrl}/worries`, worry, this.httpOptions);
  }

  getCategories() : Observable<Category[]>
  {
    return this.http.get<Category[]>(`${environment.ApiUrl}/categories`, this.httpOptions);
  }
}
