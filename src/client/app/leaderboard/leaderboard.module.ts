import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { LeaderboardRoutingModule } from './leaderboard-routing.module';
import { LeaderboardComponent } from './leaderboard.component';

@NgModule({
  imports: [
    LeaderboardRoutingModule,
    SharedModule,
  ],

  declarations: [
    LeaderboardComponent,
  ],

  exports: [
  ],
})
export class LeaderboardModule {
}
