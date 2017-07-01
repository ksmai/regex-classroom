import {
  AfterViewInit,
  Component,
  HostBinding,
  ViewChild,
} from '@angular/core';

/**
 * A simple accordion component that can be toggled between
 * open/close with some animations
 *
 * @example
 * <re-accordion>
 *   <h3 accordionToggle>A title that is used as the toggle</h3>
 *   <p>Some content here that will hide/show on toggle</p>
 * </re-accordion>
 */
@Component({
  selector: 're-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements AfterViewInit {
  @HostBinding('class.accordion-open') opened = true;
  @ViewChild('body') private body: any;
  private height: number;

  ngAfterViewInit(): void {
    this.height = this.body.nativeElement.offsetHeight;
    this.body.nativeElement.style.height = `${this.height}px`;
  }

  toggleOpen(): void {
    this.opened = !this.opened;
    const targetHeight = this.opened ? this.height : 0;
    this.body.nativeElement.style.height = `${targetHeight}px`;
  }
}
