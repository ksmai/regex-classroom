import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
} from '@angular/platform-browser/animations';
import 'hammerjs';
import '../styles/styles.scss';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { CheatsheetModule } from './cheatsheet/cheatsheet.module';
import { CoreModule } from './core/core.module';
import { FooterModule } from './footer/footer.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { LearnModule } from './learn/learn.module';
import { MapModule } from './map/map.module';
import { NavModule } from './nav/nav.module';
import { ProfileModule } from './profile/profile.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    NavModule,
    FooterModule,
    AuthModule,
    CheatsheetModule,
    MapModule,
    LearnModule,
    ProfileModule,
    LeaderboardModule,
    AppRoutingModule,
  ],

  declarations: [
    AppComponent,
  ],

  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {
}
