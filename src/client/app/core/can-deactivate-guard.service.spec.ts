import {
  CanDeactivateGuard,
  ICanComponentDeactivate,
} from './can-deactivate-guard.service';

describe('CanDeactivateGuard', () => {
  let guard: CanDeactivateGuard;

  beforeEach(() => {
    guard = new CanDeactivateGuard();
  });

  it('should call canDeactivate method on the component', () => {
    const comp = { canDeactivate: jasmine.createSpy('spy') };
    guard.canDeactivate(comp);
    expect(comp.canDeactivate).toHaveBeenCalled();
  });

  it('should return true if component has no canDeactivate method', () => {
    const comp = {} as any as ICanComponentDeactivate;
    expect(guard.canDeactivate(comp)).toBe(true);
  });
});
