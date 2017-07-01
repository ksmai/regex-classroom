import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';

/**
 * A helper function for retrying http requests on error. There is
 * a one-second delay between retries by default
 * @param {number} times - maximum number of retries
 * @param {number[]} ...badStatusCodes - the status codes that, when
 * occur, stop retrying immediately
 * @return {function} a function to be used in the subscribe chain
 *
 * @example
 * // retry at most 3 times but stop immediately if hitting 400/401
 * src.let(retry(3, 400, 401)).subscribe( ... );
 */
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
