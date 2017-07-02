import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { MdDialog } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';

import { FakeActivatedRoute, FakeUserService } from '../../../test_utils';
import { UserService } from '../../core/user.service';
import { MaterialModule } from '../../shared/material.module';
import { CompetitionComponent } from './competition.component';

let fixture: ComponentFixture<CompetitionComponent>;
let component: CompetitionComponent;
let page: Page;

class Page {
  dialogSpy: jasmine.Spy;
  winSpy: jasmine.Spy;

  constructor() {
    this.dialogSpy = spyOn(TestBed.get(MdDialog), 'open');
    this.winSpy = spyOn(TestBed.get(UserService), 'winCompetition');
  }
}

const fakeLevel = {
  name: 'name',
  difficulty: '42',
  tests: [
    { question: 'q1', answer: 'a1' },
    { question: 'q2', answer: 'a2' },
    { question: 'q3', answer: 'a3' },
  ],
};

function createCompetitionComponent() {
  fixture = TestBed.createComponent(CompetitionComponent);
  component = fixture.componentInstance;
  page = new Page();
  TestBed.get(ActivatedRoute).data = Observable.of({
    level: fakeLevel,
  });
  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
  });
}

describe('CompetitionComponent', () => {
  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [MaterialModule, NoopAnimationsModule],
        declarations: [CompetitionComponent],
        providers: [
          { provide: ActivatedRoute, useClass: FakeActivatedRoute },
          { provide: UserService, useClass: FakeUserService },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
      .compileComponents()
      .then(() => createCompetitionComponent());
  }));

  it('should implement CanDeactivate', () => {
    expect(component.canDeactivate()).toBe(true);
  });

  it('should initialize state on start', () => {
    component.onStart('Alice');
    expect(component.started).toBe(true);
    expect(component.nHit).toBe(0);
    expect(component.nMiss).toBe(0);
    expect(component.histories).toEqual([]);
    expect(component.test).toBeDefined();
    expect(component.totalTime).toBe(0);
    expect(component.opponentName).toBe('Alice');
    expect(component.opponentScore).toBe(0);
    expect(component.playerScore).toBe(0);
  });

  it('should show next question and update scores on hit', () => {
    component.onStart();
    const prevTest = component.test;
    component.onHit({ time: 42, answer: 'abc' });
    expect(component.nHit).toBe(1);
    expect(component.totalTime).toBe(42);
    expect(component.nMiss).toBe(0);
    expect(component.histories[0].attempt).toBe('abc');
    expect(component.test).not.toEqual(prevTest);
    expect(component.playerScore).toBe(10);
  });

  it('should show next question and update scores on miss', () => {
    component.onStart();
    const prevTest = component.test;
    component.onMiss({ time: 42, answer: 'abc' });
    expect(component.nHit).toBe(0);
    expect(component.totalTime).toBe(42);
    expect(component.nMiss).toBe(1);
    expect(component.histories[0].attempt).toBe('abc');
    expect(component.test).not.toEqual(prevTest);
    expect(component.playerScore).toBe(0);
  });

  it('should show summary dialog onStop', () => {
    component.onStart();
    component.onStop();
    expect(component.started).toBe(false);
    expect(page.dialogSpy).toHaveBeenCalled();
  });

  it('should update user progress if win', () => {
    component.onStart();
    for (let i = 0; i < 10; i++) {
      component.onHit({ time: 4, answer: '2' });
    }
    expect(page.winSpy).toHaveBeenCalled();
  });

  it('should not update user progress if lose', fakeAsync(() => {
    component.onStart();
    component.opponentScore = 10000;
    fixture.detectChanges();
    tick(9999);
    fixture.detectChanges();
    expect(page.winSpy).not.toHaveBeenCalled();
  }));
});
