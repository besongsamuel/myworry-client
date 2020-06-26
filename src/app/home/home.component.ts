import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Worry } from '../models/worry';
import { AuthService } from '../services/auth.service';
import { PageEvent } from '@angular/material/paginator';
import { WorryService } from '../worry/services/worry.service';
import { Router } from '@angular/router';
export const DEFAULT_IMAGE = 'assets/images/worry.png';
import * as _ from "lodash";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  searchForm = new FormGroup(
  {
    q: new FormControl('', [Validators.required, Validators.minLength(2)])
  });

  worries: Worry[] = [];

  trendingWorries: Worry[] = [];

  trendingTags: any[] = [];

  constructor(private worryService: WorryService, public authService: AuthService, private router: Router,) { }

  ngOnInit() {

    let pageEvent: PageEvent = new PageEvent();
    pageEvent.length = 6;
    pageEvent.pageIndex = 0;

    this.worryService.getTrending().subscribe((worries: Worry[]) => {

      if(worries.length > 6)
      {
        this.worries = worries.slice(0, 6);
        worries.map(x =>
        {
          if(!x.image)
          {
            x.image = DEFAULT_IMAGE;
          }
          return x;
        });
      }
      else
      {
        this.worryService.getWorries(null, pageEvent).subscribe((otherWorries: Worry[]) =>
        {
          this.worries = this.worries.concat(otherWorries);

          // Remove duplicates
          this.worries = this.worries.reduce((acc, cv) => {

            if(!acc.find(x => x.id == cv.id) && acc.length < 6){
              acc.push(cv);
            }

            return acc;
          }, []);

          this.worries = this.worries.map(x =>
          {
            if(!x.image)
            {
              x.image = DEFAULT_IMAGE;
            }
            return x;
          });
        });
      }

      this.trendingTags = [...new Set(_.flatten(worries.map(x => x.tags)))];

    });
    
  }

  createNewWorry(){

    if(this.authService.loggedIn){
      this.router.navigate(["/new/worry"]);
    }
    else{
      this.authService.requestLogin("/new/worry");
    }

    
  }

  gotoTag(event){
    this.router.navigate(['search/results'], { queryParams: { q: event.currentTarget.textContent } });
  }

  onSubmit()
  {

    this.router.navigate(['search/results'], { queryParams: { q: this.searchForm.value.q } });

  }

}
