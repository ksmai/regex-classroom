import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LevelListResolver } from '../core/level-list-resolver.service';
import { MapComponent } from './map.component';

const routes: Routes = [
  {
    path: 'map',
    component: MapComponent,
    resolve: { levels: LevelListResolver },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],

  exports: [
    RouterModule,
  ],
})
export class MapRoutingModule {
}
