/* tslint:disable:max-classes-per-file */
import { Component, DebugElement } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ITest } from '../../core/level.service';
import { MaterialModule } from '../../shared/material.module';
import { TestComponent } from './test.component';

@Component({
  template: `
    <re-test [test]="test" (hit)="onHit($event)" (miss)="onMiss($event)">
    </re-test>
  `,
})
class DummyComponent {
  test: ITest = { question: 'question', answer: 'answer' };
  onHit = jasmine.createSpy('onHit');
  onMiss = jasmine.createSpy('onMiss');
}

class Page {
  private inputEl: DebugElement;

  createElements(): void {
    this.inputEl = fixture.debugElement
      .query(By.directive(TestComponent))
      .query(By.css('input'));
  }

  answer(ans: string) {
    this.inputEl.nativeElement.value = ans;
    this.inputEl.triggerEventHandler('input', {
      target: this.inputEl.nativeElement,
    });
    fixture.detectChanges();
    tick(0);
    fixture.detectChanges();
    this.inputEl.triggerEventHandler('keyup', {
      target: this.inputEl.nativeElement,
    });
    fixture.detectChanges();
    tick(0);
    fixture.detectChanges();
  }
}

let fixture: ComponentFixture<DummyComponent>;
let component: DummyComponent;
let page: Page;

function createDummyComponent() {
  fixture = TestBed.createComponent(DummyComponent);
  component = fixture.componentInstance;
  page = new Page();
  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page.createElements();
  });
}

describe('TestComponent', () => {
  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [MaterialModule, NoopAnimationsModule, FormsModule],
        declarations: [DummyComponent, TestComponent],
      })
      .compileComponents()
      .then(() => createDummyComponent());
  }));

  it('should emit on hit', fakeAsync(() => {
    page.answer('answer');
    fixture.detectChanges();
    tick(0);
    fixture.detectChanges();
    expect(component.onHit).toHaveBeenCalled();
    expect(component.onHit.calls.first().args[0].answer).toEqual('answer');
  }));

  it('should emit on miss', fakeAsync(() => {
    page.answer('abcdef');
    fixture.detectChanges();
    tick(0);
    fixture.detectChanges();
    expect(component.onMiss).toHaveBeenCalled();
    expect(component.onMiss.calls.first().args[0].answer).toEqual('abcdef');
  }));
});
