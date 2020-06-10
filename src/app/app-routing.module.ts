import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './account/login/login.component';
import { HomeComponent } from './home/home.component';
import { AddWorryComponent } from './worry/add-worry/add-worry.component';
import { AuthGuard } from './guard/auth.guard';
import { SignupComponent } from './account/signup/signup.component';
import { WorryComponent } from './worry/worry/worry.component';
import { ProfileComponent } from './account/profile/profile.component';
import { AccountModule } from './account/account.module';
import { WorryModule } from './worry/worry.module';
import { EditWorryComponent } from './worry/edit-worry/edit-worry.component';


const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'signup', component: SignupComponent
  },
  {
    path: 'new/worry', component: AddWorryComponent, canActivate: [AuthGuard]
  },
  {
    path: 'worry/:id', component: WorryComponent
  },
  {
    path: 'edit/worry/:id', component: EditWorryComponent, canActivate: [AuthGuard]
  },
  {
    path: 'account/profile', component: ProfileComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), AccountModule, WorryModule],
  exports: [RouterModule, AccountModule, WorryModule]
})
export class AppRoutingModule { }
