import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdDialog } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';

import { FakeActivatedRoute } from '../../../test_utils';
import { MaterialModule } from '../../shared/material.module';
import { RevisionComponent } from './revision.component';

let fixture: ComponentFixture<RevisionComponent>;
let component: RevisionComponent;
let page: Page;

class Page {
  dialogSpy: jasmine.Spy;

  constructor() {
    this.dialogSpy = spyOn(TestBed.get(MdDialog), 'open');
  }
}

function createRevisionComponent() {
  fixture = TestBed.createComponent(RevisionComponent);
  component = fixture.componentInstance;
  page = new Page();
  TestBed.get(ActivatedRoute).data = Observable.of({
    level: {
      name: 'name',
      difficulty: '42',
      tests: [
        { question: 'q1', answer: 'a1' },
        { question: 'q2', answer: 'a2' },
        { question: 'q3', answer: 'a3' },
      ],
    },
  });
  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
  });
}

describe('RevisionComponent', () => {
  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [MaterialModule, NoopAnimationsModule],
        declarations: [RevisionComponent],
        providers: [
          { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
      .compileComponents()
      .then(() => createRevisionComponent());
  }));

  it('should implement CanDeactivate', () => {
    expect(component.canDeactivate()).toBe(true);
  });

  it('should initialize state on start', () => {
    component.onStart();
    expect(component.started).toBe(true);
    expect(component.nHit).toBe(0);
    expect(component.nMiss).toBe(0);
    expect(component.histories).toEqual([]);
    expect(component.test).toBeDefined();
    expect(component.totalTime).toBe(0);
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
  });

  it('should show summary dialog onStop', () => {
    component.onStart();
    component.onStop();
    expect(component.started).toBe(false);
    expect(page.dialogSpy).toHaveBeenCalled();
  });
});
