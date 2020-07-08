import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PageEvent } from '@angular/material/paginator';
import { WorryService } from '../worry/services/worry.service';
import { Worry } from '../models/worry';
import * as _ from "lodash";
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {


  pageEvent: PageEvent = new PageEvent();
  worries: Worry[] = [];
  trendingTags: any[] = [];
  currentYear: number;

  constructor(public authService: AuthService, private worryService: WorryService, private router: Router) { }

  ngOnInit(): void {

    var d = new Date();
    this.currentYear = d.getFullYear();

    this.pageEvent.pageSize = 6;
    this.pageEvent.pageIndex = 0;

    this.worryService.getTrending().subscribe((worries: Worry[]) => {

      if(worries.length > this.pageEvent.pageSize)
      {
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

          this.worries = worries.slice(0, this.pageEvent.pageSize);

        });
      }

      this.trendingTags = [...new Set(_.flatten(worries.map(x => x.tags)))].slice(0, 5);

    });
  }

  gotoTag(tag){
    this.router.navigate(['search/results'], { queryParams: { q: tag } });

    setTimeout(() => {
      $([document.documentElement, document.body]).animate({
        scrollTop: 0
      }, 500);
    }, 10);
  }

}
