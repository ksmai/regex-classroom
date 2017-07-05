import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { FakeActivatedRoute, FakeUserService } from '../../test_utils';
import { UserService } from '../core/user.service';
import { LeaderboardComponent } from './leaderboard.component';

describe('LeaderboardComponent', () => {
  let fixture: ComponentFixture<LeaderboardComponent>;
  let component: LeaderboardComponent;
  let getUserSpy: jasmine.Spy;
  let pluckSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        declarations: [LeaderboardComponent],
        providers: [
          { provide: ActivatedRoute, useClass: FakeActivatedRoute },
          { provide: UserService, useClass: FakeUserService },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderboardComponent);
    component = fixture.componentInstance;
    const routes = TestBed.get(ActivatedRoute);
    pluckSpy = jasmine.createSpy('pluckSpy');
    routes.data = { pluck: pluckSpy };
    getUserSpy = spyOn(TestBed.get(UserService), 'getUser')
      .and.callThrough();
  });

  it('should get data on init', () => {
    component.ngOnInit();
    expect(pluckSpy).toHaveBeenCalledWith('users');
    expect(getUserSpy).toHaveBeenCalled();
  });
});
