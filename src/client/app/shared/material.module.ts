import { NgModule } from '@angular/core';
import {
  MdButtonModule,
  MdCardModule,
  MdChipsModule,
  MdDialogModule,
  MdIconModule,
  MdInputModule,
  MdMenuModule,
  MdProgressBarModule,
  MdProgressSpinnerModule,
  MdSliderModule,
  MdSnackBarModule,
  MdToolbarModule,
  MdTooltipModule,
} from '@angular/material';

const mdModules: any[] = [
  MdToolbarModule,
  MdButtonModule,
  MdIconModule,
  MdProgressSpinnerModule,
  MdCardModule,
  MdInputModule,
  MdProgressBarModule,
  MdSnackBarModule,
  MdDialogModule,
  MdTooltipModule,
  MdChipsModule,
  MdSliderModule,
  MdMenuModule,
];

@NgModule({
  imports: mdModules,
  exports: mdModules,
})
export class MaterialModule {
}
