import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { User } from 'src/app/models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HelperService } from 'src/app/services/helper.service';
import { Gender } from 'src/app/models/profile';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _ from "lodash";

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as moment from 'moment';
import { AuditTrail } from 'src/app/models/audit-trail';
import { WorryService } from 'src/app/services/worry.service';
import { Worry } from 'src/app/models/worry';
import { Opinion } from 'src/app/models/opinion';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD HH:mm:ss',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ProfileComponent implements OnInit {


  imageName: string;
  profileImagePath: string;
  public fileDroped: NgxFileDropEntry;
  profileForm: FormGroup;
  user: User;
  worries: Worry[] = [];
  opinions: Opinion[] = [];
  genders = Gender;
  recentTags: string[] = []

  error: boolean = false;
  success: boolean = false;

  auditTrails: AuditTrail[] = [];

  errorMessage: string = "";
  successMessage: string = "Account was successfully updated";

  displayedColumns: string[] = ['name', 'startDate', 'endDate', 'actions'];
  dataSource: MatTableDataSource<Worry>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(public userService: UserService, private fb: FormBuilder, private worryService: WorryService) { }

  ngOnInit() {

    this.userService.getUser().subscribe((user: User) =>
    {
      this.user = user;

      this.profileImagePath = `${environment.ApiUrl}${user.profile.image}`;

      this.profileForm = this.fb.group(
      {
        id: [user.id],
        firstName: [user.firstName, Validators.required],
        lastName: [user.lastName, Validators.required],
        password: [''],
        oldPassword: [''],
        displayName: [user.displayName, Validators.required],
        profile: this.fb.group({
          image: [user.profile.image],
          dob: [user.profile.dob ? user.profile.dob : moment().format(MY_FORMATS.parse.dateInput)],
          gender: [user.profile.gender ? user.profile.gender : Gender.UNKNOWN],
          about: [user.profile.about],
          interests: [user.profile.interests]
        }),
        confirmPassword: ['']
      },{validator: this.checkIfMatchingPasswords('password', 'confirmPassword')});

      this.userService.getAuditTrails().subscribe((auditTrails: AuditTrail[]) =>
      {
        this.auditTrails = auditTrails;
      });

      this.worryService.getWorries(user.id).subscribe((worries: Worry[]) =>
      {
        this.worries = worries;
        this.dataSource = new MatTableDataSource(worries);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.recentTags = _.flatten(this.worries.map(x => x.tags));
      });

      this.worryService.getOpinions(user.id).subscribe((opinions: Opinion[]) =>
      {
        this.opinions = opinions;

      });

    });


  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  updateProfile()
  {
    if(this.profileForm.valid)
    {
      let value = this.profileForm.value;
      value.profile.dob = moment(value.profile.dob).format(MY_FORMATS.parse.dateInput)

      if(!value.oldPassword)
      {
        value = _.omit(value, ['password', 'oldPassword', 'confirmPassword']);
      }

      if(!value.profile.gender)
      {
        value.profile.gender = Gender.UNKNOWN;
      }

      this.userService.updateUser(value).subscribe((user : User) =>
      {
        this.success = true;
        this.error = false;
        this.user = user;
      },
      (err) =>
      {
        this.success = false;
        this.error = true;
        this.errorMessage = err.error.error.errorMessage;
      });

    }
  }

  removeImage()
  {
    this.imageName = "";
    this.profileImagePath =  "";
  }

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
          passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true})
      }
      else {
          return passwordConfirmationInput.setErrors(null);
      }
    }
  }

}
