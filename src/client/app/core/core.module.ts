import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpModule } from '@angular/http';

import { LevelListResolver } from './level-list-resolver.service';
import { LevelService } from './level.service';
import { UserService } from './user.service';

@NgModule({
  imports: [
    HttpModule,
  ],

  providers: [
    UserService,
    LevelService,
    LevelListResolver,
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() coreModule: CoreModule) {
    if (coreModule) {
      throw new Error('CoreModule can only be imported once');
    }
  }
}
