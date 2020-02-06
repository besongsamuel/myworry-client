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
import { ErrorSnackBarComponent } from './dialogs/error-snack-bar/error-snack-bar.component';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { EditOpinionComponent } from './worry/edit-opinion/edit-opinion.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

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
    HomeComponent,
    FileInputComponent,
    ErrorSnackBarComponent,
    ConfirmationDialogComponent,
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
    MatDialogModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [httpInterceptorProviders, AuthService, {
    provide: AuthServiceConfig,
    useFactory: provideConfig
  }],
  bootstrap: [AppComponent],
  entryComponents: [AddOpinionComponent, EditOpinionComponent, ErrorSnackBarComponent, ConfirmationDialogComponent]
})
export class AppModule { }
