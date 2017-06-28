import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import {
  AnswerHistoryComponent,
} from './answer-history/answer-history.component';
import { CompetitionComponent } from './competition/competition.component';
import { ExamComponent } from './exam/exam.component';
import { LearnRoutingModule } from './learn-routing.module';
import { RevisionComponent } from './revision/revision.component';
import {
  SummaryDialogComponent,
} from './summary-dialog/summary-dialog.component';
import { TestComponent } from './test/test.component';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    LearnRoutingModule,
  ],

  declarations: [
    ExamComponent,
    RevisionComponent,
    CompetitionComponent,
    TestComponent,
    AnswerHistoryComponent,
    SummaryDialogComponent,
  ],

  entryComponents: [
    SummaryDialogComponent,
  ],

  exports: [
    TestComponent,
    AnswerHistoryComponent,
  ],
})
export class LearnModule {
}
