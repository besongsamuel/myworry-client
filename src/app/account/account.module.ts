import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { TagInputModule } from 'ngx-chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { WorryTableComponent } from './worry-table/worry-table.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivateAccountComponent } from './activate-account/activate-account.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { WorryWidgetsModule } from '../worry-widgets/worry-widgets.module';

@NgModule({
  declarations: [SignupComponent, ProfileComponent, LoginComponent, WorryTableComponent, ActivateAccountComponent, LoginDialogComponent],
  exports: [SignupComponent, ProfileComponent, LoginComponent, LoginDialogComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgxFileDropModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    WorryWidgetsModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    TagInputModule,
    MatButtonModule,
  ]
})
export class AccountModule { }
