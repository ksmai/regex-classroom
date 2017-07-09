import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';

import { FakeRouter, FakeUserService } from '../../test_utils';
import { UserService } from '../core/user.service';
import { MaterialModule } from '../shared/material.module';
import { NavComponent } from './nav.component';

let fixture: ComponentFixture<NavComponent>;
let component: NavComponent;
let page: Page;

class Page {
  logoutButton: DebugElement;
  logoutSpy: jasmine.Spy;

  constructor() {
    this.logoutSpy = spyOn(TestBed.get(UserService), 'logout')
      .and.returnValue(Observable.of(true));
  }

  createElements() {
    this.logoutButton = fixture.debugElement.query(By.css('button'));
  }

  logout(): void {
    this.logoutButton.nativeElement.click();
    fixture.detectChanges();
  }
}

function createNavComponent() {
  fixture = TestBed.createComponent(NavComponent);
  component = fixture.componentInstance;
  page = new Page();
  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page.createElements();
  });
}

describe('NavComponent', () => {
  // work around an issue where Observable.interval does not work
  // inside zone.js, causing tests to fail
  // https://github.com/angular/angular/issues/10127
  let originalInterval: any;
  beforeAll(() => {
    originalInterval = Observable.interval;
    Observable.interval = (t: number) => Observable.empty();
  });
  afterAll(() => {
    Observable.interval = originalInterval;
  });

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [MaterialModule, NoopAnimationsModule],
        declarations: [NavComponent],
        providers: [
          { provide: Router, useClass: FakeRouter },
          { provide: UserService, useClass: FakeUserService },
        ],
      })
      .compileComponents()
      .then(() => createNavComponent());
  }));

  it('should provide logout button after user login', () => {
    TestBed.get(UserService).user$.next({ name: 'let me logout' });
    fixture.detectChanges();
    page.createElements();
    expect(page.logoutButton).toBeTruthy();
    page.logout();
    fixture.detectChanges();
    expect(page.logoutSpy).toHaveBeenCalled();
  });
});
