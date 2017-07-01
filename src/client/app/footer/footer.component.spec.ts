import { FooterComponent } from './footer.component';

let component: FooterComponent;

describe('FooterComponent', () => {
  beforeEach(() => {
    component = new FooterComponent();
  });

  it('should define relevant informaton', () => {
    expect(component.author).toBeDefined();
    expect(component.github).toBeDefined();
    expect(component.year).toBeDefined();
  });
});
