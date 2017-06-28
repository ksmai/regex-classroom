import { Component, OnDestroy, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/repeat';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ILevel, ITest } from '../../core/level.service';
import { IHistory } from '../answer-history/answer-history.component';
import {
  SummaryDialogComponent,
} from '../summary-dialog/summary-dialog.component';
import { ITestPayload } from '../test/test.component';

@Component({
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.scss'],
})
export class CompetitionComponent implements OnInit, OnDestroy {
  level: ILevel;
  test: ITest;
  started: boolean = false;
  nHit: number;
  nMiss: number;
  totalTime: number;
  histories: IHistory[];
  playerScore: number;
  opponentScore: number;
  opponentSubscription: Subscription;

  constructor(private route: ActivatedRoute, private dialog: MdDialog) {
  }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: any) => {
        this.level = data.level;
        this.started = false;
      });
  }

  ngOnDestroy(): void {
    if (this.opponentSubscription) {
      this.opponentSubscription.unsubscribe();
      this.opponentSubscription = null;
    }
  }

  onStart(): void {
    this.started = true;
    this.nHit = 0;
    this.nMiss = 0;
    this.totalTime = 0;
    this.playerScore = 0;
    this.opponentScore = 0;
    this.histories = [];
    this.createOpponent();
    this.nextTest();
  }

  onStop(): void {
    this.started = false;
    this.opponentSubscription.unsubscribe();
    this.opponentSubscription = null;
    this.dialog.open(SummaryDialogComponent, {
      data: {
        title: 'Competition summary',
        header: this.playerScore > this.opponentScore ? 'WIN' : 'LOSE',
        nHit: this.nHit,
        nMiss: this.nMiss,
        time: this.totalTime,
        footer: 'COOL',
      },
    });
  }

  onHit(payload: ITestPayload): void {
    console.log('correct');
    this.nHit += 1;
    this.totalTime += payload.time;
    this.histories.unshift({
      question: this.test.question,
      answer: this.test.answer,
      attempt: payload.answer,
      time: payload.time,
    });
    this.playerScore += 10;
    if (this.playerScore >= 100) {
      this.onStop();
    } else {
      this.nextTest();
    }
  }

  onMiss(payload: ITestPayload): void {
    console.log('wrong');
    this.nMiss += 1;
    this.totalTime += payload.time;
    this.histories.unshift({
      question: this.test.question,
      answer: this.test.answer,
      attempt: payload.answer,
      time: payload.time,
    });
    this.playerScore = Math.max(0, this.playerScore - 10);
    this.nextTest();
  }

  private nextTest(): void {
    let nextTest;
    do {
      nextTest = this.randomTest();
    } while (nextTest === this.test);
    this.test = nextTest;
  }

  private randomTest(): ITest {
    const i = Math.floor(Math.random() * this.level.tests.length);
    return this.level.tests[i];
  }

  private randomDelay(): number {
    const difficulty = this.level.difficulty;
    const mean = 2000 - 100 * difficulty;
    const spread = 100 + 100 * difficulty;
    const rand = (Math.random() - 1) * spread + mean;
    return Math.max(100, rand);
  }

  private randomCorrectness(): boolean {
    const prob = 0.5 + 0.03 * this.level.difficulty;
    return Math.random() < prob;
  }

  private createOpponent(): void {
    this.opponentSubscription = Observable
      .of(0)
      .switchMap(() => Observable
        .timer(this.randomDelay())
        .mapTo(this.randomCorrectness()),
      )
      .repeat()
      .subscribe((correct: boolean) => {
        if (correct) {
          this.opponentScore += 10;
          if (this.opponentScore >= 100) {
            this.onStop();
          }
        } else {
          this.opponentScore = Math.max(0, this.opponentScore - 10);
        }
      });
  }
}
