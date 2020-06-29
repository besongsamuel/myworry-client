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

  loading: boolean = false;

  pageEvent: PageEvent = new PageEvent();

  disableLoadMore: boolean = false;

  constructor(private worryService: WorryService, public authService: AuthService, private router: Router,) { }

  ngOnInit() {

    this.pageEvent.pageSize = 6;
    this.pageEvent.pageIndex = 0;

    this.worryService.getTrending().subscribe((worries: Worry[]) => {

      this.trendingWorries = worries;
      if(worries.length > 6)
      {
        this.worries = worries.slice(0, this.pageEvent.pageSize);
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
        this.worries = worries;
        this.worryService.getWorries(null, this.pageEvent).subscribe((otherWorries: Worry[]) =>
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

      this.trendingTags = [...new Set(_.flatten(worries.map(x => x.tags)))].slice(0, 20);

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

  gotoNextSection(event){
    event.preventDefault();
    $('html, body').animate({ scrollTop: $($(event.currentTarget).attr('href')).offset().top}, 500, 'linear');
  }

  loadMore(){

    this.loading = true;

    this.pageEvent.pageIndex += 1;

    this.worryService.getWorries(null, this.pageEvent).subscribe((otherWorries: Worry[]) =>
    {

      if(otherWorries.length < this.pageEvent.pageSize){
        this.disableLoadMore = true;
      }
      this.loading = false;
      
      this.worries = this.worries.concat(otherWorries);

      // Remove duplicates
      this.worries = this.worries.reduce((acc, cv) => {

        if(!acc.find(x => x.id == cv.id)){
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

  onSubmit()
  {

    this.router.navigate(['search/results'], { queryParams: { q: this.searchForm.value.q } });

  }

}
