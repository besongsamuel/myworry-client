import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatRadioModule} from '@angular/material/radio';
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";

import {MatTabsModule} from '@angular/material/tabs';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatBadgeModule} from '@angular/material/badge';
import { AppRoutingModule } from './app-routing.module';
import {MatChipsModule} from '@angular/material/chips';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { httpInterceptorProviders } from './http-interceptors/index';
import { AuthService } from './services/auth.service';
import { NewWorryComponent } from './worry/new-worry/new-worry.component';
import { FileInputComponent } from './custom-inputs/file-input.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
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
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import { ErrorSnackBarComponent } from './dialogs/error-snack-bar/error-snack-bar.component';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { ProfileComponent } from './account/profile/profile.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';

let socialLoginConfig = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("Google-OAuth-Client-Id")
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("502592090270326")
  }
]);

export function provideConfig() {
  return socialLoginConfig;
}

const config: SocketIoConfig = { url: 'http://127.0.0.1:3001/worry', options: {} };

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
    NewOpinionDialogComponent,
    ErrorSnackBarComponent,
    ConfirmationDialogComponent,
    ProfileComponent
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
    SocialLoginModule,
    MatTableModule,
    MatTabsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatMenuModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSelectModule,
    MatCardModule,
    MatRadioModule,
    MatExpansionModule,
    MatSortModule,
    MatButtonModule,
    MatDialogModule,
    MatBadgeModule,
    MatChipsModule,
    MatIconModule,
    MatToolbarModule,
    NgxFileDropModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [httpInterceptorProviders, AuthService, {
    provide: AuthServiceConfig,
    useFactory: provideConfig
  }],
  bootstrap: [AppComponent],
  entryComponents: [NewOpinionDialogComponent, ErrorSnackBarComponent, ConfirmationDialogComponent]
})
export class AppModule { }
