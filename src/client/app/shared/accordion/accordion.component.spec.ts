import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MaterialModule } from '../material.module';
import { AccordionComponent } from './accordion.component';

let fixture: ComponentFixture<AccordionComponent>;
let component: AccordionComponent;
let page: Page;

class Page {
  toggle: DebugElement;
  content: DebugElement;

  createElements(): void {
    this.toggle = fixture.debugElement.query(By.css('.accordion__toggle'));
    this.content = fixture.debugElement.query(By.css('.accordion__content'));
  }

  clickToggle(): void {
    this.toggle.nativeElement.click();
    fixture.detectChanges();
  }

  get contentHeight() {
    return this.content.nativeElement.style.height;
  }
}

function createAccordionComponent() {
  fixture = TestBed.createComponent(AccordionComponent);
  component = fixture.componentInstance;
  page = new Page();
  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page.createElements();
  });
}

describe('AccordionComponent', () => {
  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          MaterialModule,
        ],

        declarations: [
          AccordionComponent,
        ],
      })
      .compileComponents()
      .then(() => createAccordionComponent());
  }));

  it('should set contentHeight on init', () => {
    expect(page.contentHeight).toBeDefined();
  });

  it('should toggle betweeen open/closed', () => {
    expect(component.opened).toBe(true);
    page.clickToggle();
    expect(component.opened).toBe(false);
    page.clickToggle();
    expect(component.opened).toBe(true);
  });
});
