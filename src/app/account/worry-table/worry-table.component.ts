import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Worry } from 'src/app/models/worry';
import { WorryService } from 'src/app/worry/services/worry.service';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import * as _ from "lodash";
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-worry-table',
  templateUrl: './worry-table.component.html',
  styleUrls: ['./worry-table.component.scss']
})
export class WorryTableComponent implements OnInit {

  dataSource: MatTableDataSource<Worry>;

  private _worries: Worry[];

  @Input() worriesCount : number;

  worriesPageSize;

  displayedColumns: string[] = ['name', 'startDate', 'endDate', 'actions'];

  @Input() set worries(value: Worry[]) {
    this._worries = value;
    this.dataSource = new MatTableDataSource(this._worries);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  get worries(): Worry[] {
      return this._worries;
  }

  @Output() pageChanged = new EventEmitter<PageEvent>();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  constructor() { }

  ngOnInit(): void {
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  worriesPageChanged(event: PageEvent)
  {
    this.pageChanged.emit(event);
  }

}
