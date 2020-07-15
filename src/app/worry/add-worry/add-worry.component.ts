import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
import { WorryTag } from '../worry-tag';
import { TagifyService } from 'src/app/worry-widgets/tagify/angular-tagify.service';

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
  tagSettings: any;
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

    this.worryService.getTags().subscribe(tags => {
      this.tagSettings = {
        whitelist: tags,
        placeholder: 'Tag worry',
        maxTags: 5
      }
    });

      this.newWorryForm = this.fb.group({
        name: ["", [Validators.required, Validators.minLength(6)]],
        description: [""],
        isPrivate: [false],
        isAnonymous: [false],
        locked: false,
        image: [""],
        opinion1Label: ["Yes", [Validators.required, Validators.minLength(2)]],
        opinion2Label: ["No", [Validators.required, Validators.minLength(2)]],
        opinion3Label: [""],
        opinion4Label: [""],
        startDate: moment(),
        endDate: moment().add(1, 'M')
      });

      this.tags = [];
      
  }

  onTagAdded = (t) =>
  {
    let tag: WorryTag = { approved: false, name: t.added.value };
    this.worryService.createTag(tag).subscribe();
    this.tags = t.tags.map(x => x.value);
  }

  onTagRemoved = (e) => {
    this.tags = e.tags.map(x => x.value);
  };

  requestAutocompleteItems = () =>
  {
    return this.worryService.getTags();
  }

  onSubmit()
  {
    let worry: Worry = new Worry();

    Object.assign(worry, this.newWorryForm.value);

    worry.startDate = worry.startDate.format(MY_FORMATS.parse.dateInput);
    worry.endDate = worry.endDate.format(MY_FORMATS.parse.dateInput);

    worry.tags = this.tags;

    this.worryService.createWorry(worry).subscribe((newWorry: Worry) =>
    {
      this.router.navigate([`/worry/${newWorry ? newWorry.id : worry.id}`]);
    },
    (err) =>
    {
      this.success = false;
      console.error(err.error.error.message);
    });

  }

  removeImage()
  {

    if(!this.newWorryForm.get("image").value || this.newWorryForm.get("image").value == "")
    {
      this.newWorryForm.get("image").setValue("");
      this.imagePath =  "";
    }
    else
    {
      this.worryService.deleteImage(this.newWorryForm.get("image").value).subscribe(() =>
      {
        this.newWorryForm.get("image").setValue("");
        this.imagePath =  "";
      });
    }
    
  }

  imageSelected(files: File[]){

    if(files.length > 0){
      this.worryService.uploadImage(files[0], 'worry').subscribe((response) =>
      {
        this.newWorryForm.get("image").setValue(response.imageName);
        this.imagePath =  `${environment.ApiUrl}uploads/images/tmp/${response.imageName}`;
      });
    }
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
