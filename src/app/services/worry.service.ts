import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Worry } from '../models/worry';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category';
import { Opinion } from '../models/opinion';

@Injectable({
  providedIn: 'root'
})
export class WorryService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  worryFilter: object =
  {
    include: [
      {
        relation: 'user',
        scope: {
          fields: ['displayName', 'profile']
        }
      },
      {
        relation: 'opinions',
        scope:{
          include: [
            {
              relation: 'user',
              scope: {
                fields: ['displayName', 'profile']
              }
            }
          ]
        }
      }
    ]
  };

  constructor(private http: HttpClient) { }

  getWorries() : Observable<Worry[]>
  {
    return this.http.get<Worry[]>(`${environment.ApiUrl}/worries?filter=${encodeURIComponent(JSON.stringify(this.worryFilter))}`, this.httpOptions);
  }

  getWorry(id: string) : Observable<Worry>
  {
    return this.http.get<Worry>(`${environment.ApiUrl}/worries/${id}?filter=${encodeURIComponent(JSON.stringify(this.worryFilter))}`, this.httpOptions);
  }

  uploadImage(file: File, type: string) : Observable<any>
  {
    return this.http.post<any>(`${environment.ApiUrl}uploadImage`, toFormData({ worryImage: file, type: type}));
  }

  deleteImage(imageName: string ) : Observable<any>
  {
    return this.http.delete<any>(`${environment.ApiUrl}deleteImage/${imageName}`);
  }

  createWorry(worry: Worry) : Observable<Worry>
  {
    if(worry.id)
    {
      return this.http.put<Worry>(`${environment.ApiUrl}/worries/${worry.id}`, worry, this.httpOptions);
    }
    else
    {
      return this.http.post<Worry>(`${environment.ApiUrl}/worries`, worry, this.httpOptions);
    }

  }

  createOpinion(opinion: Opinion) : Observable<Opinion>
  {
    if(opinion.id)
    {
      return this.http.put<Opinion>(`${environment.ApiUrl}/opinions/${opinion.id}`, opinion, this.httpOptions);
    }
    else
    {
      return this.http.post<Opinion>(`${environment.ApiUrl}/opinions`, opinion, this.httpOptions);
    }

  }

  getCategories() : Observable<Category[]>
  {
    return this.http.get<Category[]>(`${environment.ApiUrl}/categories`, this.httpOptions);
  }
}

export function toFormData<T>( formValue: T ) {
  const formData = new FormData();

  for ( const key of Object.keys(formValue) ) {
    const value = formValue[key];
    formData.append(key, value);
  }

  return formData;
}
