import { Component, OnInit, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { User } from 'src/app/models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Gender, Profile } from 'src/app/models/profile';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _ from "lodash";

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as moment from 'moment';
import { AuditTrail } from 'src/app/models/audit-trail';
import { WorryService } from 'src/app/worry/services/worry.service';
import { Worry } from 'src/app/models/worry';
import { Opinion } from 'src/app/models/opinion';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { ValidateDisplayNameNotTaken } from 'src/app/validators/async-displayname-not-taken.validator';
import { isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

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
  styleUrls: ['./profile.component.scss'],
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

  profileImagePath: string;
  public fileDroped: NgxFileDropEntry;
  profileForm: FormGroup;
  tagSettings: any;
  tags: any[] = [];
  user: User;
  worries: Worry[] = [];
  sharedWorries: Worry[] = [];
  opinions: Opinion[] = [];
  genders = Gender;

  error: boolean = false;
  success: boolean = false;

  auditTrails: AuditTrail[] = [];

  displayedColumns: string[] = ['name', 'startDate', 'endDate', 'actions'];
  displayedTrailColumns: string[] = ['date', 'trail'];
  trailDataSource: MatTableDataSource<AuditTrail>;
  worriesCount;
  sharedWorriesCount;
  auditsCount;
  auditsPageSize;
  profile : Profile;

  @ViewChild(MatPaginator, {static: true}) trailPaginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) trailSort: MatSort;

  constructor(public authService: AuthService, 
    public userService: UserService, 
    private fb: FormBuilder, 
    private worryService: WorryService,
    @Inject(PLATFORM_ID) private platformId: any,
    private title: Title, meta: Meta) { 

      this.title.setTitle('Worry user profile page allows you to manage your content and profile.');
      meta.updateTag({ name: 'description', content: 'Your worry profile page allows you to manage your profile, change your passowrd and manage your worry and opinion content.' });

    }

  ngOnInit() {

    this.authService.login$.subscribe(async (user : User) => {
      this.user = user as User;

      this.worriesCount = (await this.userService.getCount(user.id, 'worries').toPromise()).count;
      this.sharedWorriesCount = (await this.worryService.getSharedWorriesCount().toPromise()).count;
      this.auditsCount = (await this.userService.getCount(user.id, 'audit-trails').toPromise()).count;

      let pEvent = new PageEvent();
      pEvent.pageIndex = 0;
      pEvent.pageSize = 5;

      this.auditTrailPageChanged(pEvent);
      this.myWorriesPageChanged(pEvent);
      this.sharedWorriesPageChanged(pEvent);

      this.profileImagePath = this.userService.getProfileImage(user);

      this.profile = this.userService.getProfile(user);

      this.tagSettings = {
        tags: this.profile.interests
      };

      this.profileForm = this.fb.group(
      {
        id: [user.userIdentity.id],
        password: [''],
        oldPassword: [''],
        displayName: [user.displayName, Validators.min(3)],
        profile: this.fb.group({
          name: this.fb.group({
            givenName: [this.profile.name.givenName, Validators.required],
            middleName: [this.profile.name.middleName],
            familyName: [this.profile.name.familyName, Validators.required],
          }),
          about: [this.profile.about],
          dob: [this.profile.dob],
          interests: [this.profile.interests],
          gender: [this.profile.gender],
          profileImage: [this.profile.profileImage],
          email: [this.profile.email]
        }) ,
        confirmPassword: ['']
      },{validator: this.checkIfMatchingPasswords('password', 'confirmPassword')});

      this.profileForm.controls['displayName'].setAsyncValidators(ValidateDisplayNameNotTaken.createValidator(this.userService));

      this.worryService.getOpinions(user.id).subscribe((opinions: Opinion[]) =>
      {
        this.opinions = opinions;

      });
    });
  }

  imageSelected(files: File[]){

    if(files.length > 0){
      this.worryService.uploadImage(files[0], 'profile').subscribe((response) =>
        {
          this.profileForm.get('profile').get('profileImage').setValue(response.imageName);
          this.profileImagePath =  `${environment.ApiUrl}uploads/images/tmp/${response.imageName}`;
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
        this.worryService.uploadImage(file, 'profile').subscribe((response) =>
        {
          this.profileForm.get('profile').get('profileImage').setValue(response.imageName);
          this.profileImagePath =  `${environment.ApiUrl}uploads/images/tmp/${response.imageName}`;
        });
      });
    }
  }

  applyTrailFilter(filterValue: string) {
    this.trailDataSource.filter = filterValue.trim().toLowerCase();

    if (this.trailDataSource.paginator) {
      this.trailDataSource.paginator.firstPage();
    }
  }

  updateProfile()
  {
    if(this.profileForm.valid)
    {
      let value = this.profileForm.value;
      value.profile.dob = moment(value.profile.dob).toISOString();

      if(this.profile.provider != 'myworry' && !value.password)
      {
        value = _.omit(value, ['password', 'oldPassword', 'confirmPassword']);
      }
      else
      {
        value = _.omit(value, ['confirmPassword']);
      }

      if(!value.profile.gender)
      {
        value.profile.gender = Gender.UNKNOWN;
      }

      value.profile.interests = this.tags;

      this.userService.patchUserIdentity(value).subscribe(() =>
      {
        this.success = true;
        this.error = false;
        this.userService.refreshUser().subscribe((u:User )=> this.user = u);
        if (isPlatformBrowser(this.platformId)) {
          window.scroll(0,0);
        }
        
      },
      (err) =>
      {
        this.success = false;
        this.error = true;
        if (isPlatformBrowser(this.platformId)) {
          window.scroll(0,0);
        }
        
      });

    }
  }

  removeImage()
  {
    this.profileForm.get('profile').get('profileImage').setValue('');
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

  onTagAdded = (t) =>
  {
    this.tags = t.tags.map(x => x.value);
  }

  onTagRemoved = (e) => {
    this.tags = e.tags.map(x => x.value);
  };

  auditTrailPageChanged(event: PageEvent)
  {
    this.userService.getAuditTrails(this.user.id, event).subscribe((auditTrails: AuditTrail[]) =>
    {

      this.auditTrails = auditTrails;
      this.trailDataSource = new MatTableDataSource(auditTrails);
      this.trailDataSource.paginator = this.trailPaginator;
      this.trailDataSource.sort = this.trailSort;

    });
  }

  myWorriesPageChanged(event: PageEvent){

    this.worryService.getWorries(this.user.id, event).subscribe((worries: Worry[]) =>
    {
      this.worries = worries;
    });
  }

  sharedWorriesPageChanged(event: PageEvent){

    this.worryService.getSharedWorries(event).subscribe((worries: Worry[]) =>
    {
      this.sharedWorries = worries;
    });
  }
}
