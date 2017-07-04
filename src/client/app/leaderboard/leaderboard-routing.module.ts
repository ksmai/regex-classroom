import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../core/auth-guard.service';
import { LeaderboardResolver } from './leaderboard-resolver.service';
import { LeaderboardComponent } from './leaderboard.component';

const routes: Routes = [
  {
    path: 'leaderboard',
    component: LeaderboardComponent,
    canActivate: [AuthGuard],
    resolve: {
      users: LeaderboardResolver,
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],

  providers: [
    LeaderboardResolver,
  ],

  exports: [
    RouterModule,
  ],
})
export class LeaderboardRoutingModule {
}
