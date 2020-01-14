import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { httpInterceptorProviders } from './http-interceptors/index';
import { AuthService } from './services/auth.service';
import { NewWorryComponent } from './worry/new-worry/new-worry.component';
import { FileInputComponent } from './custom-inputs/file-input.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { WorrySummaryComponent } from './widgets/worry-summary/worry-summary.component';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { SignupComponent } from './account/signup/signup.component';
import { NgxFileDropModule} from 'ngx-file-drop';
import { WorryComponent } from './worry/worry/worry.component';
import { OpinionComponent } from './worry/opinion/opinion.component';
import { NewOpinionDialogComponent } from './dialogs/new-opinion-dialog/new-opinion-dialog.component'




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NewWorryComponent,
    FileInputComponent,
    WorrySummaryComponent,
    SignupComponent,
    WorryComponent,
    OpinionComponent,
    NewOpinionDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TagInputModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    NgxFileDropModule
  ],
  providers: [httpInterceptorProviders, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
