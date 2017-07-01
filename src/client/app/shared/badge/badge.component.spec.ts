import { BadgeComponent } from './badge.component';

let component: BadgeComponent;

describe('BadgeComponent', () => {
  beforeEach(() => {
    component = new BadgeComponent();
  });

  it('should change colors according to inputs', () => {
    const fgColorDefault = component.fgColor;
    const bgColorDefault = component.bgColor;
    component.level = 1;
    component.type = 'b';
    component.ngOnChanges();
    expect(fgColorDefault).not.toEqual(component.fgColor);
    expect(bgColorDefault).not.toEqual(component.bgColor);
  });

  it('should change tooltips according to inputs', () => {
    const tooltipDefault = component.tooltip;
    component.level = 1;
    component.type = 'b';
    component.ngOnChanges();
    expect(tooltipDefault).not.toEqual(component.tooltip);
  });
});
