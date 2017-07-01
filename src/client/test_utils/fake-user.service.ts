import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FakeUserService {
  user$ = new BehaviorSubject<any>(null);

  fetchUser(): Observable<any> {
    return this.user$.asObservable();
  }

  login() {
    return;
  }

  signup() {
    return;
  }

  isNameAvailable() {
    return;
  }
}
