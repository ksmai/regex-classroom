import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { GuestOnlyGuard } from './guest-only-guard.service';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestOnlyGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [GuestOnlyGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],

  providers: [
    GuestOnlyGuard,
  ],

  exports: [
    RouterModule,
  ],
})
export class AuthRoutingModule {
}
