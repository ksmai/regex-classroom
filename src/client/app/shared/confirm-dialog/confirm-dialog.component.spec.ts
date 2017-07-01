/* tslint:disable:max-classes-per-file */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { By } from '@angular/platform-browser';

import { MaterialModule } from '../material.module';
import { ConfirmDialogComponent } from './confirm-dialog.component';

let fixture: ComponentFixture<ConfirmDialogComponent>;
let component: ConfirmDialogComponent;
let page: Page;
let fakeData: any;

class Page {
  title: DebugElement;
  content: DebugElement;
  yes: DebugElement;
  no: DebugElement;

  createElements(): void {
    this.title = fixture.debugElement.query(By.css('h3'));
    this.content = fixture.debugElement.query(By.css('.dialog__content'));
    const buttons = fixture.debugElement.queryAll(By.css('.dialog__button'));
    this.no = buttons[0];
    this.yes = buttons[1];
  }

  text(el: string): string {
    return this[el] ? this[el].nativeElement.textContent : null;
  }
}

class FakeMdDialogRef {
}

function createDialogComponent() {
  fixture = TestBed.createComponent(ConfirmDialogComponent);
  component = fixture.componentInstance;
  page = new Page();
  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page.createElements();
  });
}

describe('ConfirmDialogComponent', () => {
  beforeEach(() => {
    fakeData = {
      title: 'My title',
      content: 'My content',
      yes: 'some yes texts',
      no: 'No WAY',
    };
  });

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [MaterialModule],
        declarations: [ConfirmDialogComponent],
        providers: [
          { provide: MD_DIALOG_DATA, useValue: fakeData },
          { provide: MdDialogRef, useclass: FakeMdDialogRef },
        ],
      })
      .compileComponents()
      .then(() => createDialogComponent());
  }));

  it('should display injected data', () => {
    expect(page.text('title')).toEqual(fakeData.title);
    expect(page.text('content')).toEqual(fakeData.content);
    expect(page.text('yes')).toEqual(fakeData.yes);
    expect(page.text('no')).toEqual(fakeData.no);
  });
});
