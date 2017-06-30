import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';

import { ITest } from '../../core/level.service';

export interface ITestPayload {
  time: number;
  answer: string;
}

/**
 * The component responsible for displaying a question and
 * receiving the answer. It also determines the correctness of
 * the answer received and emits the received answer and elapsed time
 * accordingly
 */
@Component({
  selector: 're-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnChanges, AfterViewInit {
  @Input() test: ITest;
  @Output() hit = new EventEmitter<ITestPayload>();
  @Output() miss = new EventEmitter<ITestPayload>();
  startTime: number;
  answer: string;

  @ViewChild('inputEl') private inputEl: any;
  @ViewChild('questionEl') private questionEl: any;

  ngAfterViewInit(): void {
    setTimeout(() => this.inputEl.nativeElement.focus(), 0);
  }

  ngOnChanges(): void {
    if (this.test) {
      this.startTime = Date.now();
      this.answer = '';

      if (this.questionEl) {
        this.questionEl.nativeElement.scrollIntoView();
      }
    }
  }

  onKeyup(): void {
    const toCheck = this.test && this.answer &&
      this.answer.length >= this.test.answer.length;
    if (!toCheck) {
      return;
    }

    const time = Date.now() - this.startTime;
    if (this.answer === this.test.answer) {
      this.hit.emit({ time, answer: this.answer });
    } else {
      this.miss.emit({ time, answer: this.answer });
    }
  }
}
