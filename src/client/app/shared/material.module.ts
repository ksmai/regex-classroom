import { NgModule } from '@angular/core';
import {
  MdButtonModule,
  MdCardModule,
  MdIconModule,
  MdInputModule,
  MdProgressBarModule,
  MdSnackBarModule,
  MdToolbarModule,
} from '@angular/material';

const mdModules: any[] = [
  MdToolbarModule,
  MdButtonModule,
  MdIconModule,
  MdCardModule,
  MdInputModule,
  MdProgressBarModule,
  MdSnackBarModule,
];

@NgModule({
  imports: mdModules,
  exports: mdModules,
})
export class MaterialModule {
}
