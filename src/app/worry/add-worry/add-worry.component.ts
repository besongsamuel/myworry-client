import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { Worry } from 'src/app/models/worry';
import { MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { WorryService } from '../services/worry.service';

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
  selector: 'app-add-worry',
  templateUrl: './add-worry.component.html',
  styleUrls: ['./add-worry.component.scss'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class AddWorryComponent implements OnInit {

  newWorryForm : FormGroup;
  error: boolean = false;
  success: boolean = false;
  errorMessage: string = null;
  categories: Category[] = [];
  tags = [];
  imagePath: string;
  public fileDroped: NgxFileDropEntry;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private worryService: WorryService)
  {

  }

  ngOnInit() {

      this.worryService.getCategories().subscribe((categories: Category[]) => {

        this.categories = categories;
        this.newWorryForm = this.fb.group({
          categoryId: [this.categories[0].id, Validators.required],
          name: ["", [Validators.required, Validators.minLength(6)]],
          description: "",
          locked: false,
          image: "",
          labelFor: ["Yes", [Validators.required, Validators.minLength(2)]],
          labelAgainst: ["No", [Validators.required, Validators.minLength(2)]],
          startDate: moment(),
          endDate: moment().add(1, 'M')
        });

        this.tags = [];
      });
  }

  onSubmit()
  {
    let worry: Worry = new Worry();

    Object.assign(worry, this.newWorryForm.value);

    worry.startDate = worry.startDate.format(MY_FORMATS.parse.dateInput);
    worry.endDate = worry.endDate.format(MY_FORMATS.parse.dateInput);

    worry.tags = this.tags.map((x) => {return x.value ? x.value : x; });

    this.worryService.createWorry(worry).subscribe((newWorry: Worry) =>
    {
      this.router.navigate([`/worry/${newWorry ? newWorry.id : worry.id}`]);
    },
    (err) =>
    {
      this.success = false;
      this.errorMessage = err.error.error.message;
    });

  }

  removeImage()
  {
    this.worryService.deleteImage(this.newWorryForm.get("image").value).subscribe(() =>
    {
      this.newWorryForm.get("image").setValue("");
      this.imagePath =  "";
    });
  }

  fileDropped(files: NgxFileDropEntry[])
  {
    this.fileDroped = files[0];

    if(this.fileDroped.fileEntry.isFile)
    {
      const fileEntry = this.fileDroped.fileEntry as FileSystemFileEntry;

      fileEntry.file((file: File) =>
      {
        this.worryService.uploadImage(file, 'worry').subscribe((response) =>
        {
          this.newWorryForm.get("image").setValue(response.imageName);
          this.imagePath =  `${environment.ApiUrl}uploads/images/tmp/${response.imageName}`;
        });
      });
    }
  }

}