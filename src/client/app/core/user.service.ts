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
  level?: number;
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
          this.updateUser(user);
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
      .do((user: IUser) => this.updateUser(user))
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
      .do((user: IUser) => this.updateUser(user))
      .map((user: IUser) => !!user);
  }

  /**
   * Basic logout function
   * @return {Observable<boolean>} whether the logout was successful
   */
  logout(): Observable<boolean> {
    return this
      .http
      .get('/auth/logout')
      .let(retry(3, 401))
      .map(() => true)
      .catch(() => Observable.of(false))
      .do((success) => {
        if (success) {
          this.user$.next(null);
        }
      });
  }

  passExam(difficulty: number, score: number): void {
    const currentUser = this.user$.getValue();
    const progress = currentUser ? currentUser.progress : [];
    if (progress[difficulty] >= score) {
      return;
    }
    progress[difficulty] = score;
    this.updateProgress(progress);
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
      .subscribe((user: IUser) => this.updateUser(user));
  }

  /**
   * Check if a username has been registered
   * @param {string} name - the name to be checked
   * @return {Observable<boolean>} whether the name is available
   */
  isNameAvailable(name: string): Observable<boolean> {
    return this
      .http
      .get(`/auth/name/${name}`)
      .let(retry(3, 400))
      .map(() => true)
      .catch(() => Observable.of(false));
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
    this.updateUser(updatedUser);
  }

  /**
   * Update the current user, without emptying the progress array in
   * the process
   */
  private updateUser(user: IUser): void {
    const prevUser = this.user$.getValue();
    if (!user && !prevUser) {
      this.user$.next(null);
    } else if (user) {
      this.user$.next(user);
    } else {
      this.user$.next({ progress: prevUser.progress });
    }
  }
}
