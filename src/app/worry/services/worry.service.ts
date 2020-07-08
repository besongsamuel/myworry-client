import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Worry } from '../../models/worry';
import { environment } from 'src/environments/environment';
import { Category } from '../../models/category';
import { Opinion } from '../../models/opinion';
import { OpinionLike } from '../../models/opinion-like';
import { PageEvent } from '@angular/material/paginator';
import { WorryTag } from '../worry-tag';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { WorrySubscription } from 'src/app/worry-subscription';

@Injectable()
export class WorryService {
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  worryFilter: object =
  {
    "include": [
      {
        "relation": "user",
        "scope":{
          "include": [
            {
              "relation": "userIdentity",
            }
          ]
        }
      },
      {
        "relation": "opinions",
        "scope":{
          "include": [
            {
              "relation": "user",
              "scope":{
                "include": [
                  {
                    "relation": "userIdentity",
                  }
                ]
              }
            },
            {
              "relation": "opinionLikes"
            }
          ]
        }
      }
    ]
  };

  opinionFilter: object =
  {
    "include": [
      {
        "relation": "user",
        "scope":{
          "include": [
            {
              "relation": "userIdentity",
            }
          ]
        }
      },
      {
        "relation": "opinionLikes"
      }
    ]
  }

  constructor(private http: HttpClient) { }

  subscribeToWorry(subscription: WorrySubscription) : Observable<WorrySubscription> {
    return this.http.post<any>(`${environment.ApiUrl}worry-subscriptions/`, subscription, this.httpOptions);
  }

  unsubscribeFromWorry(id: string) : Observable<void> {
    return this.http.delete<void>(`${environment.ApiUrl}worry-subscriptions/${id}`);
  }

  getSharedWorries(pageEvent: PageEvent) : Observable<Worry[]> {

    let worryFilter: any = this.worryFilter;

    if(pageEvent)
    {
      this.worryFilter["limit"] = pageEvent.length;
      this.worryFilter["offset"] = (pageEvent.pageIndex) * pageEvent.pageSize;
    }

    return this.http.get<Worry[]>(`${environment.ApiUrl}shared-worries?filter=${encodeURIComponent(JSON.stringify(worryFilter))}`, this.httpOptions);

  }

  getSharedWorriesCount() : Observable<any>{
    return this.http.get<any>(`${environment.ApiUrl}shared-worries/count`, this.httpOptions);
  }

  toggleLike(opinionId: string) : Observable<any>
  {
    return this.http.post<any>(`${environment.ApiUrl}toggleLike/${opinionId}`, null);
  }

  canPostOpinion(worryId: string) : Observable<boolean>
  {
    return this.http.get<boolean>(`${environment.ApiUrl}worries/can-post-opinion/${worryId}`, this.httpOptions);
  }

  getTrending(){
    return this.http.get<object>(`${environment.ApiUrl}worries/trending`, this.httpOptions);
  }

  getTags() : Observable<string[]>
  {
     return this.http.get<WorryTag[]>(`${environment.ApiUrl}tags`, this.httpOptions).pipe(map((x) => { 
       return x.map(tag => tag.name);
      }));
  }

  createTag(tag: WorryTag) : Observable<WorryTag>{
    return this.http.post<any>(`${environment.ApiUrl}tags`, tag, this.httpOptions);
  }

  searchWorries(queryString, pageEvent?: PageEvent){

    let limit = 5;
    let offset = 0;
    if(pageEvent){
      limit = pageEvent.length;
      offset = (pageEvent.pageIndex) * pageEvent.pageSize;
    }
    
    return this.http.get<object>(`${environment.ApiUrl}search?q=${queryString}&limit=${limit}&offset=${offset}`, this.httpOptions);

  }

  getWorries(userId? : string, pageEvent?: PageEvent) : Observable<Worry[]>
  {

      let worryFilter: any = JSON.parse(JSON.stringify(this.worryFilter));

      if(userId)
      {
        worryFilter["where"] = { userId: userId};
      }

      if(pageEvent)
      {
        worryFilter["limit"] = pageEvent.pageSize;
        worryFilter["offset"] = (pageEvent.pageIndex) * pageEvent.pageSize;
      }

      worryFilter.order = 'date_created DESC';

      return this.http.get<Worry[]>(`${environment.ApiUrl}worries?filter=${encodeURIComponent(JSON.stringify(worryFilter))}`, this.httpOptions);

  }

  getWorry(id: string) : Observable<Worry>
  {
    return this.http.get<Worry>(`${environment.ApiUrl}worries/${id}?filter=${encodeURIComponent(JSON.stringify(this.worryFilter))}`, this.httpOptions);
  }

  getOpinion(id: string) : Observable<Opinion>
  {
    return this.http.get<Opinion>(`${environment.ApiUrl}opinions/${id}?filter=${encodeURIComponent(JSON.stringify(this.opinionFilter))}`, this.httpOptions);
  }

  shareWorry(worry: Worry, users : User[]) : Observable<void>{
    return this.http.post<any>(`${environment.ApiUrl}worry-shares`, {
      worryId: worry.id,
      userIds: users.map(x => x.id)
    }, this.httpOptions);
  }

  getOpinions(userId?:string): Observable<Opinion[]>
  {
    if(userId)
    {

      let opinionFilter: object =
      {
        "include": [
          {
            "relation": "user",
          },
          {
            "relation": "opinionLikes"
          }
        ],
        "where": { "userId": userId }
      }
      return this.http.get<Opinion[]>(`${environment.ApiUrl}opinions?filter=${encodeURIComponent(JSON.stringify(opinionFilter))}`, this.httpOptions);
    }
    else
    {
      return this.http.get<Opinion[]>(`${environment.ApiUrl}opinions?filter=${encodeURIComponent(JSON.stringify(this.opinionFilter))}`, this.httpOptions);
    }
  }

  deleteOpinion(id: string) : Observable<void>
  {
    return this.http.delete<any>(`${environment.ApiUrl}opinions/${id}`, this.httpOptions);
  }

  deleteWorry(id: string) : Observable<void>
  {
    return this.http.delete<any>(`${environment.ApiUrl}worries/${id}`, this.httpOptions);
  }

  getOpinionLike(id: string) : Observable<OpinionLike>
  {
    return this.http.get<OpinionLike>(`${environment.ApiUrl}opinion-likes/${id}`, this.httpOptions);
  }

  uploadImage(file: File, type: string) : Observable<any>
  {
    return this.http.post<any>(`${environment.ApiUrl}uploadImage`, toFormData({ image: file, type: type}));
  }

  deleteImage(imageName: string ) : Observable<any>
  {

    let deleteFilter = JSON.stringify({
      imageName: imageName
    });

    return this.http.delete<any>(`${environment.ApiUrl}deleteImage?deleteFilter=${deleteFilter}`);
  }

  createWorry(worry: Worry) : Observable<Worry>
  {
    if(worry.id)
    {
      return this.http.put<Worry>(`${environment.ApiUrl}worries/${worry.id}`, worry, this.httpOptions);
    }
    else
    {
      return this.http.post<Worry>(`${environment.ApiUrl}worries`, worry, this.httpOptions);
    }

  }

  patchWorry(worry: Partial<Worry>) : Observable<Worry>
  {
    return this.http.patch<Worry>(`${environment.ApiUrl}worries/${worry.id}`, worry, this.httpOptions);
  }

  createOrEditOpinion(opinion: Partial<Opinion>) : Observable<Opinion>
  {
    if(opinion.id)
    {
      return this.http.put<Opinion>(`${environment.ApiUrl}opinions/${opinion.id}`, opinion, this.httpOptions);
    }
    else
    {
      return this.http.post<Opinion>(`${environment.ApiUrl}opinions`, opinion, this.httpOptions);
    }

  }

  getCategories() : Observable<Category[]>
  {
    return this.http.get<Category[]>(`${environment.ApiUrl}categories`, this.httpOptions);
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
