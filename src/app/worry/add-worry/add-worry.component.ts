import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { WorryService } from 'src/app/services/worry.service';
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

  initForm(worry?: Worry)
  {
    this.newWorryForm = this.fb.group(
    {
      categoryId: [worry.categoryId ? worry.categoryId : this.categories[0].id, Validators.required],
      name: [worry.name, [Validators.required, Validators.minLength(6)]],
      description: worry.description,
      locked: worry.locked,
      labelFor: [worry.labelFor, [Validators.required, Validators.minLength(2)]],
      labelAgainst: [worry.labelAgainst, [Validators.required, Validators.minLength(2)]],
      startDate: moment(worry.startDate),
      endDate: moment(worry.endDate)
    });

    if(this.editLimited)
    {
      this.newWorryForm.get('name').disable();
      this.newWorryForm.get('description').disable();
      this.newWorryForm.get('categoryId').disable();
      this.newWorryForm.get('labelFor').disable();
      this.newWorryForm.get('labelAgainst').disable();
    }

    this.tags = worry.tags;

  }

  ngOnInit() {

    // Attempt to get the id for a worry if we are in edit mode.
    let id = this.route.snapshot.paramMap.get('id');

    if(id)
    {
      this.worryService.getWorry(id).subscribe((worry: Worry) =>
      {
        if(worry.image)
        {
          this.imagePath = worry.image;
        }
        else
        {
          this.imagePath = DEFAULT_IMAGE;
        }

        this.worry = worry;

        if(worry.opinions && worry.opinions.length > 0)
        {
          this.editLimited = true;
        }

        this.worryService.getCategories().subscribe((categories: Category[]) =>
        {
          this.categories = categories;
          this.initForm(this.worry);
        });

      });
    }
    else
    {
      this.worryService.getCategories().subscribe((categories: Category[]) =>
      {
        this.categories = categories;
        this.initForm(this.worry);
      });
    }
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
      saveRequest$ = this.worryService.patchWorry(_.pick(this.worry, ['id', 'image', 'tags', 'startDate', 'endDate']));
    }
    else
    {
      saveRequest$ = this.worryService.createWorry(this.worry);
    }

    saveRequest$.subscribe((newWorry: Worry) =>
    {
      this.router.navigate([`/worry/${newWorry ? newWorry.id : this.worry.id}`]);
    },
    (err) =>
    {
      this.success = false;
      this.errorMessage = err.error.error.message;
    });

  }

  removeImage()
  {
    this.worryService.deleteImage(this.worry.image).subscribe(() =>
    {
      this.worry.image = "";
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
          this.worry.image = response.imageName;
          this.imagePath =  `${environment.ApiUrl}uploads/images/tmp/${response.imageName}`;
        });
      });
    }
  }

}
