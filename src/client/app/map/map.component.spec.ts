import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { FakeActivatedRoute, FakeUserService } from '../../test_utils';
import { UserService } from '../core/user.service';
import { MapComponent } from '../map/map.component';

let fixture: ComponentFixture<MapComponent>;
let component: MapComponent;

function createMapComponent() {
  fixture = TestBed.createComponent(MapComponent);
  component = fixture.componentInstance;
  const fakeUser = {
    name: 'Hello world',
    id: '123',
    progress: [1, 2, 0],
    badges: [2, 1, 3],
    level: 0.3,
  };
  const fakeLevels = [
    { difficulty: 0, tests: [1, 2, 3] as any[] },
    { difficulty: 1, tests: [2, 3] as any[] },
    { difficulty: 2, tests: [1] as any[] },
    { difficulty: 3, tests: [3, 3] as any[] },
  ];
  TestBed.get(UserService).user$.next(fakeUser);
  TestBed.get(ActivatedRoute).snapshot = {
    data: {
      levels: fakeLevels,
    },
  };
  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
  });
}

describe('MapComponent', () => {
  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        declarations: [MapComponent],
        providers: [
          { provide: UserService, useClass: FakeUserService },
          { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
      .compileComponents()
      .then(() => createMapComponent());
  }));

  it('should process the stream of user data', () => {
    expect(component.levels.map((l) => l.locked))
      .toEqual([false, false, false, true]);
    expect(component.scores).toEqual(['33%', '40%', '0%', null]);
    expect(component.badges).toEqual([
      [false, true],
      [true, false],
      [true, true],
      [false, false],
    ]);
  });
});
