import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CanDeactivateGuard } from '../core/can-deactivate-guard.service';
import { CanLearnGuard } from './can-learn-guard.service';
import { CompetitionComponent } from './competition/competition.component';
import { ExamComponent } from './exam/exam.component';
import { RevisionComponent } from './revision/revision.component';
import { TestResolver } from './test-resolver.service';

const routes: Routes = [
  {
    path: 'revision/:difficulty',
    component: RevisionComponent,
    canActivate: [CanLearnGuard],
    canDeactivate: [CanDeactivateGuard],
    resolve: { level: TestResolver },
  },
  {
    path: 'exam/:difficulty',
    component: ExamComponent,
    canActivate: [CanLearnGuard],
    canDeactivate: [CanDeactivateGuard],
    resolve: { level: TestResolver },
  },
  {
    path: 'competition/:difficulty',
    component: CompetitionComponent,
    canActivate: [CanLearnGuard],
    canDeactivate: [CanDeactivateGuard],
    resolve: { level: TestResolver },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],

  providers: [
    CanLearnGuard,
    TestResolver,
  ],

  exports: [
    RouterModule,
  ],
})
export class LearnRoutingModule {
}
