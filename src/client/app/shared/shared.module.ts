import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AccordionComponent } from './accordion/accordion.component';
import { MaterialModule } from './material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],

  declarations: [
    AccordionComponent,
  ],

  exports: [
    CommonModule,
    MaterialModule,
    AccordionComponent,
  ],
})
export class SharedModule {
}
