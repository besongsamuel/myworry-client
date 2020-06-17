import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WorryService } from '../services/worry.service';
import { Worry } from 'src/app/models/worry';

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

  worryDataSource : any[] = [];

  displayedColumns : string[] = ["worry"]

  constructor(private worryService: WorryService) { }

  ngOnInit(): void {
  }

  onSubmit()
  {
    this.worryService.searchWorries(this.searchForm.value.q).subscribe(worries => {
      
    });
  }

}
