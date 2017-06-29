import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AccordionComponent } from './accordion/accordion.component';
import {
  CompareStringDirective,
} from './compare-string/compare-string.directive';
import {
  ConfirmDialogComponent,
} from './confirm-dialog/confirm-dialog.component';
import { MaterialModule } from './material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],

  declarations: [
    AccordionComponent,
    CompareStringDirective,
    ConfirmDialogComponent,
  ],

  entryComponents: [
    ConfirmDialogComponent,
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
