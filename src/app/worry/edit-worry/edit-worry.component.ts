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
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DEFAULT_IMAGE } from 'src/app/home/home.component';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { WorryService } from '../services/worry.service';
import { WorryTag } from '../worry-tag';

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
  selector: 'app-edit-worry',
  templateUrl: './edit-worry.component.html',
  styleUrls: ['./edit-worry.component.scss'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class EditWorryComponent implements OnInit {

  newWorryForm : FormGroup;
  error: boolean = false;
  success: boolean = false;
  tags = [];
  worry: Worry = new Worry();
  imagePath: string;
  public fileDroped: NgxFileDropEntry;

  editLimited: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private worryService: WorryService)
  {

  }

  initForm(worry: Worry)
  {
    this.newWorryForm = this.fb.group(
    {
      name: [worry.name, [Validators.required, Validators.minLength(6)]],
      description: [worry.description],
      locked: [worry.locked],
      image: [worry.image],
      opinion1Label: [worry.opinion1Label, [Validators.required, Validators.minLength(2)]],
      opinion2Label: [worry.opinion2Label, [Validators.required, Validators.minLength(2)]],
      opinion3Label: [worry.opinion3Label],
      opinion4Label: [worry.opinion4Label],
      startDate: moment(worry.startDate),
      endDate: moment(worry.endDate),
      isPrivate: [worry.isPrivate],
      isAnonymous: [worry.isAnonymous == null ? false : worry.isAnonymous]
    });

    if(this.editLimited)
    {
      this.newWorryForm.get('name').disable();
      this.newWorryForm.get('description').disable();
      this.newWorryForm.get('opinion1Label').disable();
      this.newWorryForm.get('opinion2Label').disable();
      this.newWorryForm.get('opinion3Label').disable();
      this.newWorryForm.get('opinion4Label').disable();
    }

    this.tags = worry.tags;
  }

  ngOnInit() {

    let id = this.route.snapshot.paramMap.get('id');

    if(id)
    {
      this.worryService.getWorry(id).subscribe((worry: Worry) =>
      {

        this.imagePath = worry.image ? worry.image : DEFAULT_IMAGE;

        this.worry = worry;

        if(worry.opinions && worry.opinions.length > 0)
        {
          this.editLimited = true;
        }

        this.initForm(worry);
      }, (err) => {
        console.error(`An unexpected error occured while trying to get worry with id ${id}. Details: `, err)
      });
    }
  }

  onTagAdded = (t) =>
  {
    let tag: WorryTag = { approved: false, name: t.value };
    this.worryService.createTag(tag).subscribe();
  }

  requestAutocompleteItems = () =>
  {
    return this.worryService.getTags();
  }

  onSubmit()
  {
    let worry: Worry = this.newWorryForm.value;

    Object.assign(this.worry, worry);

    this.worry.startDate = worry.startDate.format(MY_FORMATS.parse.dateInput);
    this.worry.endDate = worry.endDate.format(MY_FORMATS.parse.dateInput);
    this.worry.tags = this.tags.map((x) => {return x.value ? x.value : x; });

    let saveRequest$;

    if(this.editLimited)
    {
      saveRequest$ = this.worryService.patchWorry(_.pick(this.worry, ['id', 'image', 'tags', 'startDate', 'endDate', 'isPrivate', 'isAnonymous']));
    }
    else
    {
      saveRequest$ = this.worryService.patchWorry(_.omit(this.worry, ['user']));
    }

    saveRequest$.subscribe((newWorry: Worry) =>
    {
      this.router.navigate([`/worry/${newWorry ? newWorry.id : this.worry.id}`]);
    },
    (err) =>
    {
      this.success = false;
      this.error = true;
      console.error(err.error.error.message);
    });

  }

  removeImage()
  {

    if(!this.newWorryForm.get("image").value || this.newWorryForm.get("image").value == "")
    {
      this.newWorryForm.get("image").setValue("");
      this.worry.image = "";
      this.imagePath =  "";
    }
    else
    {
      this.worryService.deleteImage(this.newWorryForm.get("image").value).subscribe(() =>
      {
        this.newWorryForm.get("image").setValue("");
        this.worry.image = "";
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
