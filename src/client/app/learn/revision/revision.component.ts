import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import {
  ICanComponentDeactivate,
} from '../../core/can-deactivate-guard.service';
import { ILevel, ITest } from '../../core/level.service';
import {
  ConfirmDialogComponent,
} from '../../shared/confirm-dialog/confirm-dialog.component';
import { IHistory } from '../answer-history/answer-history.component';
import {
  SummaryDialogComponent,
} from '../summary-dialog/summary-dialog.component';
import { ITestPayload } from '../test/test.component';

@Component({
  templateUrl: './revision.component.html',
  styleUrls: ['./revision.component.scss'],
})
export class RevisionComponent implements OnInit, ICanComponentDeactivate {
  level: ILevel;
  test: ITest;
  started: boolean = false;
  nHit: number;
  nMiss: number;
  totalTime: number;
  histories: IHistory[];

  constructor(private route: ActivatedRoute, private dialog: MdDialog) {
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
        title: 'End revision?',
        yes: 'END',
        no: 'BACK',
      },
    }).afterClosed();
  }

  onStart(): void {
    this.started = true;
    this.nHit = 0;
    this.nMiss = 0;
    this.totalTime = 0;
    this.histories = [];
    this.nextTest();
  }

  onStop(): void {
    this.started = false;
    this.dialog.open(SummaryDialogComponent, {
      data: {
        title: 'Revision summary',
        header: 'Good job!',
        nHit: this.nHit,
        nMiss: this.nMiss,
        time: this.totalTime,
        footer: "It's time for exam!",
      },
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
}
