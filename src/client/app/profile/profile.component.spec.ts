import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FakeUserService } from '../../test_utils';
import { UserService } from '../core/user.service';
import { ProfileComponent } from './profile.component';

let fixture: ComponentFixture<ProfileComponent>;
let component: ProfileComponent;

function createProfileComponent() {
  fixture = TestBed.createComponent(ProfileComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
  });
}

describe('ProfileComponent', () => {
  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        declarations: [ProfileComponent],
        providers: [{ provide: UserService, useClass: FakeUserService }],
        schemas: [NO_ERRORS_SCHEMA],
      })
      .compileComponents()
      .then(() => createProfileComponent());
  }));

  it('should compute current experience based on level', () => {
    expect(component.experience(1.3)).toBe(30);
    expect(component.experience(42)).toBe(0);
  });

  it('should round level down', () => {
    expect(component.wholeLevel(1.7)).toBe(1);
    expect(component.wholeLevel(0.99)).toBe(0);
  });

  it('should extract badge from a collection', () => {
    expect(component.hasBadge(16, 4)).toBe(true);
    expect(component.hasBadge(47, 4)).toBe(false);
  });
});
