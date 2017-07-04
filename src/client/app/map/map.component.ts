/* tslint:disable:no-bitwise */
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

/**
 * Renders the sitemap for navigating to different levels and showing
 * user progress on each level
 */
@Component({
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  user: IUser = { progress: [], badges: [] };
  levels: IMapItem[] = [];
  scores: string[] = [];
  badges: boolean[][] = [];
  badgesPerLevel: number = 2;
  promptClosed: boolean = false;
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
        this.updateBadges();
      });
  }

  onClosePrompt(): void {
    this.promptClosed = true;
  }

  get shouldPrompt(): boolean {
    return !this.promptClosed &&
      !this.user.name && (
      this.user.progress.some((p) => p > 0) ||
      this.user.badges.some((b) => b > 0));
  }

  private updateUser(user: IUser): void {
    if (user) {
      this.user = user;
    } else {
      this.user = { progress: [], badges: [] };
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

  private updateBadges(): void {
    this.badges = this.route.snapshot.data.levels
      .map((level: ILevel, i: number) => {
        const badgeGroup = this.user.badges[i] || 0;
        const badges: boolean[] = [];
        for (let j = 0; j < this.badgesPerLevel; j++) {
          badges.push(!!((badgeGroup >>> j) & 1));
        }
        return badges;
      });
  }
}
