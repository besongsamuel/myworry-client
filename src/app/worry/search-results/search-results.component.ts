import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WorryService } from '../services/worry.service';
import { Worry } from 'src/app/models/worry';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DEFAULT_IMAGE } from 'src/app/home/home.component';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

  searchForm = new FormGroup(
  {
    q: new FormControl('', [Validators.required, Validators.minLength(2)])
  });

  worries: Worry[] = [];

  worryDataSource: MatTableDataSource<Worry>;

  pageSize;

  defaultImage: string = DEFAULT_IMAGE;

  displayedColumns : string[] = ["worry"];

  worries$ : Observable<any>;

  count: number;

  pageEvent: PageEvent = new PageEvent();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private worryService: WorryService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = 10;
    this.pageEvent.length = 10;

    this.worries$ = this.route.queryParams.pipe(
      tap((params: any) => this.searchForm.get('q').setValue(params['q'])),
      switchMap((params: any) =>
      this.worryService.searchWorries(params['q'], this.pageEvent)
    ));

    this.worries$.subscribe(result => {
      this.worries = result.worries;
      this.count = result.count;

      this.worryDataSource = new MatTableDataSource(this.worries);
      this.worryDataSource.paginator = this.paginator;
      this.worryDataSource.sort = this.sort;
    });

  }

  onSubmit()
  {
    this.router.navigate(['search/results'], { queryParams: { q: this.searchForm.value.q } });
  }

  pageChanged(event: PageEvent)
  {
    this.pageEvent = event;
    this.router.navigate(['search/results'], { queryParams: { q: this.searchForm.value.q } });

  }

}
