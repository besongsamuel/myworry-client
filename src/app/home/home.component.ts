import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Worry } from '../models/worry';
import { AuthService } from '../services/auth.service';
import { PageEvent } from '@angular/material/paginator';
import { WorryService } from '../worry/services/worry.service';
import { Router } from '@angular/router';
export const DEFAULT_IMAGE = 'assets/images/worry.png';
import * as _ from "lodash";
import { Title, Meta } from '@angular/platform-browser';

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

  excess: Worry[] = [];

  trendingTags: any[] = [];

  loading: boolean = false;

  pageEvent: PageEvent = new PageEvent();

  disableLoadMore: boolean = false;

  constructor(private worryService: WorryService, public authService: AuthService, private router: Router,
    private title: Title, 
    private meta: Meta) { }

  ngOnInit() {

    this.meta.updateTag({ property: 'og:title', content: 'MyWorry' });
    this.meta.updateTag({ property: 'og:description', content: 'MyWorry lets you express the things you are worried about and let people share their valuable opinions. You can later view statistics by gender or age group.' });
    this.meta.updateTag({ property: 'og:url', content: `https://www.myworry.ca/en/` });
    this.meta.updateTag({ property: 'og:type', content: `website` });
    this.meta.updateTag({ property: 'og:image', content: 'https://www.myworry.ca/en/assets/home-background.png' });

    this.title.setTitle("MyWorry | Express your worry and get valued opinions. ");

    this.pageEvent.pageSize = 6;
    this.pageEvent.pageIndex = 0;

    this.worryService.getTrending().subscribe((worries: Worry[]) => {

      this.trendingWorries = worries;
      if(worries.length > this.pageEvent.pageSize)
      {
        worries.map(x =>
        {
          if(!x.image)
          {
            x.image = DEFAULT_IMAGE;
          }
          return x;
        });

        this.excess = worries.slice(this.pageEvent.pageSize);
        this.worries = worries.slice(0, this.pageEvent.pageSize);
      }
      else
      {
        this.worries = worries;
        this.worryService.getWorries(null, this.pageEvent).subscribe((otherWorries: Worry[]) =>
        {
          let worries = this.worries.concat(otherWorries);

          // Remove duplicates
          worries = worries.reduce((acc, cv) => {

            if(!acc.find(x => x.id == cv.id)){
              acc.push(cv);
            }

            return acc;
          }, []);

          worries = worries.map(x =>
          {
            if(!x.image)
            {
              x.image = DEFAULT_IMAGE;
            }
            return x;
          });

          this.excess = worries.slice(this.pageEvent.pageSize);
          this.worries = worries.slice(0, this.pageEvent.pageSize);
          this.pageEvent.pageIndex += 1;

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

    if(this.excess.length > 0){
      this.worries = this.worries.concat(...this.excess);
      this.excess = [];
    }

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

      this.pageEvent.pageIndex += 1;
    });

  }

  onSubmit()
  {

    this.router.navigate(['search/results'], { queryParams: { q: this.searchForm.value.q } });

  }

}
