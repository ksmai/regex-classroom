import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';

import { ITest } from '../../core/level.service';

export interface ITestPayload {
  time: number;
  answer: string;
}

@Component({
  selector: 're-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnChanges {
  @Input() test: ITest;
  @Output() hit = new EventEmitter<ITestPayload>();
  @Output() miss = new EventEmitter<ITestPayload>();
  startTime: number;
  answer: string;

  ngOnChanges(): void {
    if (this.test) {
      this.startTime = Date.now();
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
    this.answer = '';
  }
}
