import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { WorryService } from 'src/app/services/worry.service';
import { Worry } from 'src/app/models/worry';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';

const moment =  _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD hh:mm:ss',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-new-worry',
  templateUrl: './new-worry.component.html',
  styleUrls: ['./new-worry.component.css'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class NewWorryComponent implements OnInit {


  newWorryForm : FormGroup;
  error: boolean = false;
  success: boolean = false;
  errorMessage: string = null;
  categories: Category[] = [];
  tags = [];
  image: File;

  constructor(private fb: FormBuilder, private worryService: WorryService)
  {

    this.initForm();

    worryService.getCategories().subscribe((categories: Category[]) =>
    {
      this.categories = categories;
    });

  }

  initForm()
  {
    this.newWorryForm = this.fb.group(
      {
        categoryId: '',
        name: '',
        description: '',
        locked: false,
        labelFor: 'Yes',
        labelAgainst: 'No',
        startDate: moment(),
        endDate: moment().add(30, 'days')
      });

      this.tags = [];
      this.image = null;
  }

  ngOnInit() {
  }

  onSubmit()
  {
    let worry: Worry = this.newWorryForm.value;
    worry.tags = this.tags.map(x => x.value);
    worry.startDate = worry.startDate.format(MY_FORMATS.parse.dateInput);
    worry.endDate = worry.endDate.format(MY_FORMATS.parse.dateInput);
    var requestBody = { data: JSON.stringify(worry), image: this.image };
    
    this.worryService.createWorry(requestBody).subscribe(() =>
    {
      this.errorMessage = null;
      this.success = true;
      this.initForm();
    },
    (err) =>
    {
      this.success = false;
      this.errorMessage = err.error.error.message;
    });

  }

}
