import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

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
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss'],
})
export class ExamComponent implements OnInit, ICanComponentDeactivate {
  level: ILevel;
  test: ITest;
  shuffledTests: ITest[];
  started: boolean = false;
  nHit: number;
  nMiss: number;
  totalTime: number;
  histories: IHistory[];
  testIndex: number;

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
        this.test = null;
      });
  }

  canDeactivate(): Observable<boolean>|boolean {
    return !this.started || this.dialog.open(ConfirmDialogComponent, {
      data: {
        content: 'Flee? Really?',
        yes: 'FLEE NOW',
        no: 'CANCEL',
      },
    }).afterClosed();
  }

  onStart(): void {
    this.started = true;
    this.nHit = 0;
    this.nMiss = 0;
    this.totalTime = 0;
    this.histories = [];
    this.testIndex = 0;
    this.shuffleTests();
    this.nextTest();
  }

  onStop(): void {
    this.started = false;

    const finished = this.testIndex > this.level.tests.length;
    let header: string;
    let footer: string;
    if (finished) {
      this.userService.passExam(this.level.difficulty, this.nHit);
      header = this.nHit > 0 ? 'Well done, you passed!' : 'You failed';
      footer = this.nHit > 0 ?
        'Get ready for the next level' :
        'Practice makes perfect';
    } else {
      header = "You flee'd!";
      footer = "You won't always feel ready. That's why it is brave";
    }

    this.dialog.open(SummaryDialogComponent, {
      data: {
        header,
        footer,
        title: 'Report',
        nHit: this.nHit,
        nMiss: this.nMiss,
        time: this.totalTime,
      },
    });
  }

  onFlee(): void {
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
    this.nextTest();
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
    this.nextTest();
  }

  private nextTest(): void {
    const nextTest = this.shuffledTests[this.testIndex];
    this.testIndex += 1;
    if (nextTest) {
      this.test = nextTest;
    } else {
      this.onStop();
    }
  }

  private shuffleTests(): void {
    const tests = this.level.tests.slice();
    for (let i = 0; i < tests.length; i++) {
      const j: number = Math.floor(Math.random() * (tests.length - i)) + i;
      [tests[i], tests[j]] = [tests[j], tests[i]];
    }
    this.shuffledTests = tests;
  }
}
