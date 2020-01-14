import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NewWorryComponent } from './worry/new-worry/new-worry.component';
import { AuthGuard } from './guard/auth.guard';
import { SignupComponent } from './account/signup/signup.component';
import { WorryComponent } from './worry/worry/worry.component';


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
    path: 'worry/:id', component: WorryComponent, canActivate: [AuthGuard]
  },
  {
    path: 'worry/new', component: NewWorryComponent, canActivate: [AuthGuard]
  },
  {
    path: 'worry/edit/:id', component: NewWorryComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
