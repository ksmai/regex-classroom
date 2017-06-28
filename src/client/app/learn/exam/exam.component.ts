import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { ILevel, ITest } from '../../core/level.service';
import { UserService } from '../../core/user.service';
import { IHistory } from '../answer-history/answer-history.component';
import {
  SummaryDialogComponent,
} from '../summary-dialog/summary-dialog.component';
import { ITestPayload } from '../test/test.component';

@Component({
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss'],
})
export class ExamComponent implements OnInit {
  level: ILevel;
  test: ITest;
  started: boolean = false;
  nHit: number;
  nMiss: number;
  totalTime: number;
  histories: IHistory[];
  private testIndex: number;

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
    this.userService.passExam(this.level.difficulty, this.nHit);
    this.dialog.open(SummaryDialogComponent, {
      data: {
        title: 'Exam summary',
        header: 'Good job!',
        nHit: this.nHit,
        nMiss: this.nMiss,
        time: this.totalTime,
        footer: 'You passed the exam!',
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
    this.nextTest();
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
    this.nextTest();
  }

  private nextTest(): void {
    const nextTest = this.level.tests[this.testIndex];
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
    this.level.tests = tests;
  }
}
