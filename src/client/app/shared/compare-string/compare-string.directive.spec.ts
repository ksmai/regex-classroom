import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CompareStringDirective } from './compare-string.directive';

@Component({
  template: '<p [reCompareString]="referenceString">{{testString}}</p>',
})
class DummyComponent {
  testString = 'abd';
  referenceString = 'abc';
}

let component: DummyComponent;
let fixture: ComponentFixture<DummyComponent>;
let directive: CompareStringDirective;

function createDummyComponent() {
  fixture = TestBed.createComponent(DummyComponent);
  component = fixture.componentInstance;
  directive = fixture.debugElement
    .query(By.directive(CompareStringDirective))
    .injector.get(CompareStringDirective);
  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
  });
}

describe('CompareStringDirective', () => {
  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        declarations: [DummyComponent, CompareStringDirective],
      })
      .compileComponents()
      .then(() => createDummyComponent());
  }));

  it('should match content with the reference string', () => {
    const parentEl = fixture.debugElement
      .query(By.directive(CompareStringDirective)).nativeElement;
    const children = (Array as any).from(parentEl.children);
    expect(children.length).toEqual(component.testString.length);
    children.forEach((child: HTMLElement, i: number) => {
      expect(child.textContent).toEqual(component.testString[i]);
      if (child.textContent === component.referenceString[i]) {
        expect(child.style.color).toEqual(directive.matchColor);
      } else {
        expect(child.style.color).toEqual(directive.wrongColor);
      }
    });
  });
});
