import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './map.component';

@NgModule({
  imports: [
    SharedModule,
    MapRoutingModule,
  ],

  declarations: [
    MapComponent,
  ],

  exports: [
  ],
})
export class MapModule {
}
