import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { httpInterceptorProviders } from './http-interceptors/index';
import { AuthService } from './services/auth.service';
import { FileInputComponent } from './custom-inputs/file-input.component';
import { AddOpinionComponent } from './worry/add-opinion/add-opinion.component'
import { SnackBarComponent } from './dialogs/snack-bar/snack-bar.component';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { EditOpinionComponent } from './worry/edit-opinion/edit-opinion.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { environment } from 'src/environments/environment';
import { MatChipsModule } from '@angular/material/chips';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { LoginDialogComponent } from './account/login-dialog/login-dialog.component';
import { WorryStatsDialogComponent } from './worry/worry-stats-dialog/worry-stats-dialog.component';
import { MissionItemComponent } from './mission-item/mission-item.component';

let socialLoginConfig = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("692988413035-h58vdctiqo07c72lnmv22uuofieca6at.apps.googleusercontent.com")
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("502592090270326")
  }
]);

export function provideConfig() {
  return socialLoginConfig;
}

let localID = window.sessionStorage.getItem('locale');

if(!localID){
  localID = 'en-US';
}

const config: SocketIoConfig = { url: `${environment.SocketUrl}:3001/worry`, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FileInputComponent,
    SnackBarComponent,
    ConfirmationDialogComponent,
    PrivacyPolicyComponent,
    TermsOfServiceComponent,
    MissionItemComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocialLoginModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDialogModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [httpInterceptorProviders, AuthService, {
    provide: AuthServiceConfig,
    useFactory: provideConfig
  }],
  bootstrap: [AppComponent],
  entryComponents: [AddOpinionComponent, EditOpinionComponent, SnackBarComponent, LoginDialogComponent, WorryStatsDialogComponent, ConfirmationDialogComponent]
})
export class AppModule { }
