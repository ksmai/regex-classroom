import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { retry } from './http.helper';

export interface IUser {
  id?: string;
  name?: string;
  progress: number[];
}

@Injectable()
export class UserService {
  private user$: BehaviorSubject<IUser>;
  private fetching: boolean;

  constructor(private http: Http) {
    this.user$ = new BehaviorSubject(null);
    this.fetching = false;
  }

  /**
   * get the current user from cache, without http requests
   * @return {Observable<IUser>} a hot stream of user data
   */
  getUser(): Observable<IUser> {
    return this.user$.asObservable();
  }

  /**
   * get the current user from the server, limiting to one
   * ongoing request at any given time
   * @return {Observable<IUser>} a hot stream of user data
   */
  fetchUser(): Observable<IUser> {
    if (!this.fetching) {
      this.fetching = true;
      this
        .http
        .get('/auth/me')
        .map((res: Response) => res.json().user as IUser)
        .let(retry(3, 401))
        .catch((err: Error|any) => Observable.of(null))
        .subscribe((user: IUser) => {
          this.user$.next(user);
          this.fetching = false;
        });
    }

    return this.user$.asObservable();
  }

  /**
   * Basic login function
   * @param {string} username
   * @param {string} password
   * @return {Observable<boolean>} whether the login was successful
   */
  login(username: string, password: string): Observable<boolean> {
    return this
      .http
      .post('/auth/login', { username, password })
      .map((res: Response) => res.json().user as IUser)
      .let(retry(3, 401))
      .catch((err: Error|any) => Observable.of(null))
      .do((user: IUser) => this.user$.next(user))
      .map((user: IUser) => !!user);
  }

  /**
   * Basic signup function
   * @param {string} username
   * @param {string} password
   * @return {Observable<boolean>} whether the signup was successful
   */
  signup(username: string, password: string): Observable<boolean> {
    return this
      .http
      .post('/auth/signup', { username, password })
      .map((res: Response) => res.json().user as IUser)
      .let(retry(3, 401))
      .catch((err: Error|any) => Observable.of(null))
      .do((user: IUser) => this.user$.next(user))
      .map((user: IUser) => !!user);
  }

  /**
   * update the progress of a user, authenticated or not
   * If user has not logged in, data will be lost after leaving the app
   * @param {number[]} progress - the whole updated progress array
   */
  updateProgress(progress: number[]): void {
    this.optimisticUpdate(progress);
    this
      .http
      .put('/api/v1/progress', { progress })
      .let(retry(3, 401))
      .map((res: Response) => res.json().user as IUser)
      .catch((err: Error|any) => Observable.of(null))
      .subscribe((user: IUser) => {
        if (user) {
          this.user$.next(user);
        }
      });
  }

  /**
   * Update the user data in the application, unrelated to whether
   * data is persisted in the server
   * @param {number[]} progress - the whole updated progress array
   */
  private optimisticUpdate(progress: number[]): void {
    const currentUser = this.user$.getValue();
    let updatedUser: IUser;
    if (currentUser) {
      updatedUser = Object.assign({}, currentUser, { progress });
    } else {
      updatedUser = { progress };
    }
    this.user$.next(updatedUser);
  }
}
