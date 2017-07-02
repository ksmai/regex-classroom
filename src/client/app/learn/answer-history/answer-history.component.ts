import { Component, Input } from '@angular/core';

export interface IHistory {
  question: string;
  answer: string;
  time: number;
  attempt: string;
}

/**
 * Displays previous attempts to questions
 */
@Component({
  selector: 're-answer-history',
  templateUrl: './answer-history.component.html',
  styleUrls: ['./answer-history.component.scss'],
})
export class AnswerHistoryComponent {
  @Input() histories: IHistory[];
}
