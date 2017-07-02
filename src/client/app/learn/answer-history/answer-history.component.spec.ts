import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AnswerHistoryComponent } from './answer-history.component';

let fixture: ComponentFixture<AnswerHistoryComponent>;
let component: AnswerHistoryComponent;
let page: Page;

class Page {
  items: DebugElement[];

  createElements() {
    this.items = fixture.debugElement.queryAll(By.css('.answer'));
  }
}

function createAnswerHistoryComponent() {
  fixture = TestBed.createComponent(AnswerHistoryComponent);
  component = fixture.componentInstance;
  page = new Page();
  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page.createElements();
  });
}

describe('AnswerHistoryComponent', () => {
  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        declarations: [AnswerHistoryComponent],
        schemas: [NO_ERRORS_SCHEMA],
      })
      .compileComponents()
      .then(() => createAnswerHistoryComponent());
  }));

  it('should only display 2 items at most', () => {
    component.histories = [
      { question: 'q', answer: 'a', attempt: 'b', time: 42 },
      { question: 'q', answer: 'a', attempt: 'b', time: 42 },
      { question: 'q', answer: 'a', attempt: 'b', time: 42 },
      { question: 'q', answer: 'a', attempt: 'b', time: 42 },
    ];
    fixture.detectChanges();
    page.createElements();
    expect(page.items.length).toBe(2);
  });
});
