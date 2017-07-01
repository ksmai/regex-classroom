import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { FakeActivatedRoute } from '../../test_utils';
import { CheatsheetComponent } from './cheatsheet.component';

let fixture: ComponentFixture<CheatsheetComponent>;
let component: CheatsheetComponent;
let page: Page;

class Page {
  spy: jasmine.Spy;

  constructor() {
    this.spy = spyOn(TestBed.get(ActivatedRoute).data, 'pluck');
  }
}

function createCheatsheetComponent() {
  fixture = TestBed.createComponent(CheatsheetComponent);
  component = fixture.componentInstance;
  page = new Page();
  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
  });
}

describe('CheatsheetComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheatsheetComponent],
      providers: [
        { provide: ActivatedRoute, useClass: FakeActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
    .then(() => createCheatsheetComponent());
  }));

  it('should pluck data from ActivatedRoute', () => {
    expect(page.spy).toHaveBeenCalled();
  });
});
