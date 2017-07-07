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

import {
  ICanComponentDeactivate,
} from '../../core/can-deactivate-guard.service';
import { ILevel, ITest } from '../../core/level.service';
import { UserService } from '../../core/user.service';
import {
  ConfirmDialogComponent,
} from '../../shared/confirm-dialog/confirm-dialog.component';
import { IHistory } from '../answer-history/answer-history.component';
import {
  SummaryDialogComponent,
} from '../summary-dialog/summary-dialog.component';
import { ITestPayload } from '../test/test.component';

@Component({
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.scss'],
})
export class CompetitionComponent implements OnInit, OnDestroy, ICanComponentDeactivate {
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
  opponentName: string;

  constructor(
    private route: ActivatedRoute,
    private dialog: MdDialog,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: any) => {
        this.level = data.level;
        this.started = false;
      });
  }

  canDeactivate(): Observable<boolean>|boolean {
    return !this.started || this.dialog.open(ConfirmDialogComponent, {
      data: {
        content: 'Surrender?',
        yes: 'SURRENDER',
        no: 'NO',
      },
    }).afterClosed();
  }

  ngOnDestroy(): void {
    if (this.opponentSubscription) {
      this.opponentSubscription.unsubscribe();
      this.opponentSubscription = null;
    }
  }

  // Alice is slower than Bob, but more accurate
  // see randomDelay and randomCorrectness for details
  onStart(name: string = 'Alice'): void {
    this.started = true;
    this.nHit = 0;
    this.nMiss = 0;
    this.totalTime = 0;
    this.playerScore = 0;
    this.opponentScore = 0;
    this.opponentName = name;
    this.histories = [];
    this.createOpponent();
    this.nextTest();
  }

  onStop(): void {
    if (!this.started) {
      return;
    }
    this.started = false;
    this.opponentSubscription.unsubscribe();
    this.opponentSubscription = null;

    let title: string;
    let header: string;
    let footer: string;
    if (this.playerScore >= 100) {
      const difficulty = this.level.difficulty;
      const opponentIndex = this.opponentName === 'Alice' ? 0 : 1;
      this.userService.winCompetition(difficulty, opponentIndex);
      title = 'Congratulations';
      header = 'You won!';
      footer = 'Goob job!';
    } else if (this.opponentScore >= 100) {
      title = 'Aww';
      header = 'It was a close game';
      footer = 'Better luck next time';
    } else {
      title = 'You surrendered';
      header = 'Never give up again!';
      footer = 'Always try your best!';
    }

    this.dialog.open(SummaryDialogComponent, {
      data: {
        title,
        header,
        footer,
        nHit: this.nHit,
        nMiss: this.nMiss,
        time: this.totalTime,
      },
    });
  }

  onSurrender(): void {
    (this.canDeactivate() as Observable<boolean>)
      .subscribe((answer: boolean) => {
        if (answer) {
          this.onStop();
        }
      });
  }

  onHit(payload: ITestPayload): void {
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
    const personalFactor = this.opponentName === 'Alice' ? 100 : 0;
    const rand = (Math.random() - 1) * spread + mean + personalFactor;
    return Math.max(100, rand);
  }

  private randomCorrectness(): boolean {
    const prob = 0.5 + 0.03 * this.level.difficulty;
    const personalFactor = this.opponentName === 'Alice' ? 0.03 : 0;
    return Math.random() < prob + personalFactor;
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
