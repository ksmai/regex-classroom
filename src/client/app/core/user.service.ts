/* tslint:disable:no-bitwise */
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
  totalBadges?: number;
  progress: number[];
  badges: number[];
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
   * Signup with the current progress/badges earned, if any
   * @param {string} username
   * @param {string} password
   * @return {Observable<boolean>} whether the signup was successful
   */
  signup(username: string, password: string): Observable<boolean> {
    const currentUser = this.user$.getValue();
    const progress = (currentUser && currentUser.progress) || [];
    const badges = (currentUser && currentUser.badges) || [];

    return this
      .http
      .post('/auth/signup', { username, password, progress, badges })
      .map((res: Response) => res.json().user as IUser)
      .let(retry(3, 401))
      .catch((err: Error|any) => Observable.of(null))
      .do((user: IUser) => this.updateUser(user))
      .map((user: IUser) => !!user);
  }

  /**
   * Logout and clear all data in the app
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

  /**
   * Update progress if the user gets a higher score than before
   * @param {number} difficulty - difficulty level of the exam
   * @param {number} score - the score user gets in the exam
   */
  passExam(difficulty: number, score: number): void {
    const currentUser = this.user$.getValue();
    const progress = (currentUser && currentUser.progress) || [];
    const badges = (currentUser && currentUser.badges) || [];
    if (progress[difficulty] >= score) {
      return;
    }
    progress[difficulty] = score;
    this.updateProgress(progress, badges);
  }

  /**
   * Update badges of the user, if it is a new one
   * Note that the badges array stores numbers, where each number
   * represents a collection of badges at the corresponding level,
   * and the n-th least significant bit represents the n-th badge at that
   * level
   * @param {number} difficulty - difficulty level of the exam
   * @param {number} opponent - zero-based opponent index, 1-to-1 correspond
   *                            to the badges
   */
  winCompetition(difficulty: number, opponent: number): void {
    const currentUser = this.user$.getValue();
    const progress = (currentUser && currentUser.progress) || [];
    const badges = (currentUser && currentUser.badges) || [];
    if (badges[difficulty] && (badges[difficulty] >>> opponent) & 1) {
      return;
    }
    if (!badges[difficulty]) {
      badges[difficulty] = 0;
    }
    badges[difficulty] |= (1 << opponent);
    this.updateProgress(progress, badges);
  }

  /**
   * update the progress of a user, authenticated or not
   * If user has not logged in, data will be lost after leaving the app
   * @param {number[]} progress - the whole updated progress array
   */
  updateProgress(progress: number[], badges: number[]): void {
    this.optimisticUpdate(progress, badges);
    this
      .http
      .put('/api/v1/progress', { progress, badges })
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
  private optimisticUpdate(progress: number[], badges: number[]): void {
    const currentUser = this.user$.getValue();
    let updatedUser: IUser;
    if (currentUser) {
      updatedUser = Object.assign({}, currentUser, { progress, badges });
    } else {
      updatedUser = { progress, badges };
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
      this.user$.next({
        progress: prevUser.progress,
        badges: prevUser.badges,
      });
    }
  }
}
