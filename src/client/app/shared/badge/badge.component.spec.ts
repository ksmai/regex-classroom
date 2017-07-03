import { BadgeComponent } from './badge.component';

let component: BadgeComponent;

describe('BadgeComponent', () => {
  beforeEach(() => {
    component = new BadgeComponent();
  });

  it('should update classes', () => {
    component.level = 1;
    component.type = 'b';
    component.locked = true;
    component.ngOnChanges();
    expect(component.classes.badge).toBeTruthy();
    expect(component.classes['badge--level-1']).toBeTruthy();
    expect(component.classes['badge--type-b']).toBeTruthy();
    expect(component.classes['badge--locked']).toBeTruthy();
  });

  it('should change tooltips according to inputs', () => {
    const tooltipDefault = component.tooltip;
    component.level = 1;
    component.type = 'b';
    component.ngOnChanges();
    expect(tooltipDefault).not.toEqual(component.tooltip);
  });
});
