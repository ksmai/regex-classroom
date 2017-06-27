import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CheatsheetRoutingModule } from './cheatsheet-routing.module';
import { CheatsheetComponent } from './cheatsheet.component';

@NgModule({
  imports: [
    SharedModule,
    CheatsheetRoutingModule,
  ],

  declarations: [
    CheatsheetComponent,
  ],

  exports: [
    CheatsheetComponent,
  ],
})
export class CheatsheetModule {
}
