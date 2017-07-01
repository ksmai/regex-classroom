import { ReflectiveInjector } from '@angular/core';
import {
  BaseRequestOptions,
  ConnectionBackend,
  Http,
  RequestOptions,
  Response,
  ResponseOptions,
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { LevelService } from './level.service';

describe('LevelService', () => {
  let injector: ReflectiveInjector;
  let levelService: LevelService;
  let lastConnection: any;
  let backend: MockBackend;

  beforeEach(() => {
    injector = ReflectiveInjector.resolveAndCreate([
      { provide: RequestOptions, useClass: BaseRequestOptions },
      { provide: ConnectionBackend, useClass: MockBackend },
      Http,
      LevelService,
    ]);
    levelService = injector.get(LevelService);
    lastConnection = null;
    backend = injector.get(ConnectionBackend);
    backend.connections.subscribe((conn: any) => lastConnection = conn);
  });

  afterEach(() => {
    backend.verifyNoPendingRequests();
  });

  it('should fetch level data from server', (done) => {
    const levels = [{ id: 'id', difficulty: 0, name: 'foo', tests: [
      { question: 'some question', answer: '42' },
    ]}];
    levelService.getLevels().subscribe((levelList) => {
      expect(levelList).toEqual(levels);
      done();
    });
    expect(lastConnection).toBeDefined();
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: { levels },
    })));
  });

  it('should cache level data and not fetch again from server', (done) => {
    const levels = [{ id: 'id', difficulty: 0, name: 'foo', tests: [
      { question: 'some question', answer: '42' },
    ]}];
    levelService.getLevels().subscribe((levelList) => {
      expect(levelList).toEqual(levels);
      lastConnection = null;

      // query again after the first one returns
      levelService.getLevels().subscribe((levelList2) => {
        expect(levelList2).toEqual(levels);
        expect(lastConnection).toBe(null);
        done();
      });
    });
    expect(lastConnection).toBeDefined();
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: { levels },
    })));
  });

  it('should get a particular level based on diffiuclty', (done) => {
    const levels = [{ id: 'id', difficulty: 0, name: 'foo', tests: [
      { question: 'some question', answer: '42' },
    ]}];
    levelService.getLevel(0).subscribe((level) => {
      expect(level).toEqual(levels[0]);
      done();
    });
    expect(lastConnection).toBeDefined();
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: { levels },
    })));
  });
});
