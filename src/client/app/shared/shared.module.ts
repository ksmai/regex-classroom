import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AccordionComponent } from './accordion/accordion.component';
import {
  CompareStringDirective,
} from './compare-string/compare-string.directive';
import { MaterialModule } from './material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],

  declarations: [
    AccordionComponent,
    CompareStringDirective,
  ],

  exports: [
    CommonModule,
    MaterialModule,
    AccordionComponent,
    CompareStringDirective,
  ],
})
export class SharedModule {
}
