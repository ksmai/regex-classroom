import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';

import { FakeRouter, FakeUserService } from '../../../test_utils';
import { UserService } from '../../core/user.service';
import { MaterialModule } from '../../shared/material.module';
import { LoginComponent } from './login.component';

let fixture: ComponentFixture<LoginComponent>;
let component: LoginComponent;
let page: Page;

class Page {
  username: DebugElement;
  password: DebugElement;
  submit: DebugElement;
  form: FormGroup;
  loginSpy: jasmine.Spy;
  navigateSpy: jasmine.Spy;
  snackbarSpy: jasmine.Spy;

  constructor() {
    this.navigateSpy = spyOn(TestBed.get(Router), 'navigate');
    this.snackbarSpy = spyOn(TestBed.get(MdSnackBar), 'open');
  }

  createElements() {
    const controls = fixture.debugElement.queryAll(By.css('.login__control'));
    this.username = controls[0];
    this.password = controls[1];
    this.submit = fixture.debugElement.query(By.css('button'));
    this.form = component.form;
  }

  input(username: string, password: string) {
    this.username.nativeElement.value = username;
    this.password.nativeElement.value = password;
    this.username.triggerEventHandler('input', {
      target: this.username.nativeElement,
    });
    this.password.triggerEventHandler('input', {
      target: this.password.nativeElement,
    });
    fixture.detectChanges();
  }

  login() {
    this.submit.nativeElement.click();
    fixture.detectChanges();
  }

  allowLogin() {
    if (!this.loginSpy) {
      this.loginSpy = spyOn(TestBed.get(UserService), 'login');
    }
    this.loginSpy.and.returnValue(Observable.of(true));
  }

  disallowLogin() {
    if (!this.loginSpy) {
      this.loginSpy = spyOn(TestBed.get(UserService), 'login');
    }
    this.loginSpy.and.returnValue(Observable.of(false));
  }
}

function createLoginComponent() {
  fixture = TestBed.createComponent(LoginComponent);
  component = fixture.componentInstance;
  page = new Page();
  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page.createElements();
  });
}

describe('LoginComponent', () => {
  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          MaterialModule,
          ReactiveFormsModule,
          NoopAnimationsModule,
        ],
        declarations: [LoginComponent],
        providers: [
          { provide: UserService, useClass: FakeUserService },
          { provide: Router, useClass: FakeRouter },
        ],
      })
      .compileComponents()
      .then(() => createLoginComponent());
  }));

  it('should log user in and redirect', () => {
    page.allowLogin();
    page.input('username', 'password');
    page.login();
    expect(page.loginSpy).toHaveBeenCalledWith('username', 'password');
    expect(page.navigateSpy).toHaveBeenCalled();
    expect(page.snackbarSpy).toHaveBeenCalled();
  });

  it('should display error if credentials are wrong', () => {
    page.disallowLogin();
    page.input('username', 'password');
    page.login();
    expect(page.loginSpy).toHaveBeenCalledWith('username', 'password');
    expect(page.navigateSpy).not.toHaveBeenCalled();
    expect(page.snackbarSpy).toHaveBeenCalled();
  });

  it('should validate username field', () => {
    page.input('x', 'password');
    expect(page.form.valid).toBeFalsy();
    page.input('x'.repeat(30), 'password');
    expect(page.form.valid).toBeFalsy();
    page.input('!@#$%', 'password');
    expect(page.form.valid).toBeFalsy();
    page.input('A good name', 'password');
    expect(page.form.valid).toBeTruthy();
  });

  it('should validate password field', () => {
    page.input('username', 'p');
    expect(page.form.valid).toBeFalsy();
    page.input('username', 'p'.repeat(50));
    expect(page.form.valid).toBeFalsy();
    page.input('username', 'password');
    expect(page.form.valid).toBeTruthy();
  });
});
