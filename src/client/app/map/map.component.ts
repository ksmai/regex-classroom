import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ILevel } from '../core/level.service';
import { IUser, UserService } from '../core/user.service';

interface IMapItem {
  name: string;
  difficulty: number;
  locked: boolean;
}

@Component({
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  user: IUser = { progress: [] };
  levels: IMapItem[] = [];
  scores: string[] = [];
  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
  ) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.userService
      .getUser()
      .subscribe((user: IUser) => {
        this.updateUser(user);
        this.updateLevels();
        this.updateScores();
      });
  }

  private updateUser(user: IUser): void {
    if (user) {
      this.user = user;
    } else {
      this.user = { progress: [] };
    }
  }

  private updateLevels(): void {
    this.levels = this.route.snapshot.data.levels
      .map((level: ILevel) => {
        return { name: level.name, difficulty: level.difficulty };
      })
      .map((item: any, i: number) => {
        if (i === 0) {
          item.locked = false;
        } else if (this.user.progress[i - 1]) {
          item.locked = false;
        } else {
          item.locked = true;
        }
        return item;
      });
  }

  private updateScores(): void {
    let nCumulatedTest = 0;
    this.scores = this.route.snapshot.data.levels
      .map((level: ILevel, i: number) => {
        nCumulatedTest += level.tests.length;
        if (this.user.progress[i] === undefined) {
          return null;
        } else {
          const score = 100 * this.user.progress[i] / nCumulatedTest;
          return `${Math.round(score)}%`;
        }
      });
  }
}
