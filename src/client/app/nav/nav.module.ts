import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { NavComponent } from './nav.component';

@NgModule({
  imports: [
    RouterModule,
    SharedModule,
  ],

  declarations: [
    NavComponent,
  ],

  exports: [
    NavComponent,
  ],
})
export class NavModule {
}
