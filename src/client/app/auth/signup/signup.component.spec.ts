import { DebugElement } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';

import { FakeRouter, FakeUserService } from '../../../test_utils';
import { UserService } from '../../core/user.service';
import { MaterialModule } from '../../shared/material.module';
import { SignupComponent } from './signup.component';

let fixture: ComponentFixture<SignupComponent>;
let component: SignupComponent;
let page: Page;

class Page {
  username: DebugElement;
  password: DebugElement;
  confirmPassword: DebugElement;
  submit: DebugElement;
  form: FormGroup;
  signupSpy: jasmine.Spy;
  navigateSpy: jasmine.Spy;
  snackbarSpy: jasmine.Spy;
  checkSpy: jasmine.Spy;

  constructor() {
    this.navigateSpy = spyOn(TestBed.get(Router), 'navigate');
    this.snackbarSpy = spyOn(TestBed.get(MdSnackBar), 'open')
      .and.returnValue({ onAction: () => Observable.empty() });
  }

  createElements() {
    const controls = fixture.debugElement
      .queryAll(By.css('.signup__control'));
    this.username = controls[0];
    this.password = controls[1];
    this.confirmPassword = controls[2];
    this.submit = fixture.debugElement.query(By.css('button'));
    this.form = component.form;
  }

  input(username: string, password: string, password2: string) {
    this.username.nativeElement.value = username;
    this.password.nativeElement.value = password;
    this.confirmPassword.nativeElement.value = password2;
    this.username.triggerEventHandler('input', {
      target: this.username.nativeElement,
    });
    this.password.triggerEventHandler('input', {
      target: this.password.nativeElement,
    });
    this.confirmPassword.triggerEventHandler('input', {
      target: this.confirmPassword.nativeElement,
    });
    fixture.detectChanges();
    tick(10000);
    fixture.detectChanges();
  }

  signup() {
    this.submit.nativeElement.click();
    fixture.detectChanges();
  }

  allowSignup() {
    if (!this.signupSpy) {
      this.signupSpy = spyOn(TestBed.get(UserService), 'signup');
    }
    this.signupSpy.and.returnValue(Observable.of(true));
  }

  disallowSignup() {
    if (!this.signupSpy) {
      this.signupSpy = spyOn(TestBed.get(UserService), 'signup');
    }
    this.signupSpy.and.returnValue(Observable.of(false));
  }

  nameAvailable() {
    if (!this.checkSpy) {
      this.checkSpy = spyOn(TestBed.get(UserService), 'isNameAvailable');
    }
    this.checkSpy.and.returnValue(Observable.of(true));
  }

  nameNotAvailable() {
    if (!this.checkSpy) {
      this.checkSpy = spyOn(TestBed.get(UserService), 'isNameAvailable');
    }
    this.checkSpy.and.returnValue(Observable.of(false));
  }
}

function createSignupComponent() {
  fixture = TestBed.createComponent(SignupComponent);
  component = fixture.componentInstance;
  page = new Page();
  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page.createElements();
  });
}

describe('SignupComponent', () => {
  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          MaterialModule,
          ReactiveFormsModule,
          NoopAnimationsModule,
        ],
        declarations: [SignupComponent],
        providers: [
          { provide: UserService, useClass: FakeUserService },
          { provide: Router, useClass: FakeRouter },
        ],
      })
      .compileComponents()
      .then(() => createSignupComponent());
  }));

  it('should signup user and redirect', fakeAsync(() => {
    page.allowSignup();
    page.nameAvailable();
    page.input('username', 'password', 'password');
    page.signup();
    expect(page.signupSpy).toHaveBeenCalledWith('username', 'password');
    expect(page.navigateSpy).toHaveBeenCalled();
    expect(page.snackbarSpy).toHaveBeenCalled();
  }));

  it('should display error if something goes wrong', fakeAsync(() => {
    page.disallowSignup();
    page.nameAvailable();
    page.input('username', 'password', 'password');
    page.signup();
    expect(page.signupSpy).toHaveBeenCalledWith('username', 'password');
    expect(page.navigateSpy).not.toHaveBeenCalled();
    expect(page.snackbarSpy).toHaveBeenCalled();
    tick(10000);
  }));

  it('should validate username', fakeAsync(() => {
    page.nameAvailable();
    page.input('u', 'password', 'password');
    expect(page.form.valid).toBe(false);
    page.input('u'.repeat(100), 'password', 'password');
    expect(page.form.valid).toBe(false);
    page.input('!@#$%', 'password', 'password');
    expect(page.form.valid).toBe(false);

    page.nameNotAvailable();
    page.input('username', 'password', 'password');
    expect(page.form.valid).toBe(false);

    page.nameAvailable();
    page.input('username', 'password', 'password');
    expect(page.form.valid).toBe(true);
  }));

  it('should validate passwords', fakeAsync(() => {
    page.nameAvailable();
    page.input('username', 'p', 'p');
    expect(page.form.valid).toBe(false);
    page.input('username', 'p'.repeat(100), 'p'.repeat(100));
    expect(page.form.valid).toBe(false);
    page.input('username', 'password', 'password2');
    expect(page.form.valid).toBe(false);
    page.input('username', 'password', 'password');
    expect(page.form.valid).toBe(true);
  }));

});
