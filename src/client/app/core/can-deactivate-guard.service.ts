import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';

export interface ICanComponentDeactivate {
  canDeactivate: () => Observable<boolean>|Promise<boolean>|boolean;
}

/**
 * Guards route changes and confirms before destroying the component
 * Requires the component to implement {@link ICanComponentDeactivate}
 * and specify {@link CanDeactivateGuard} in the route configs
 */
@Injectable()
export class CanDeactivateGuard implements CanDeactivate<ICanComponentDeactivate> {
  canDeactivate(component: ICanComponentDeactivate) {
    return component && component.canDeactivate ?
      component.canDeactivate() :
      true;
  }
}
