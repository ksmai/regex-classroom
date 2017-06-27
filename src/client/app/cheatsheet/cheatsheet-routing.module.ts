import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LevelListResolver } from '../core/level-list-resolver.service';
import { CheatsheetComponent } from './cheatsheet.component';

const routes: Routes = [
  {
    path: 'cheatsheet',
    component: CheatsheetComponent,
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
export class CheatsheetRoutingModule {
}
