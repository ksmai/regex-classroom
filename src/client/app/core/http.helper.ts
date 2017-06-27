import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';

export function retry(times: number, ...badStatusCodes: number[]) {
  return <T>(src: Observable<T>): Observable<T> => {
    return src
      .retryWhen((errors: Observable<any>) => {
        return errors
          .mergeMap((error: any) => {
            return (badStatusCodes as any).includes(error.status) ?
              Observable.throw(error) :
              Observable.of(error);
          })
          .delay(1000)
          .take(times);
      });
  };
}
