import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
} from '@angular/core';

/**
 * Highlight the text in two different colors, based on the comparison
 * with the reference string
 *
 * @example
 * <p reCompareString="abc">abd</p>
 */
@Directive({
  selector: '[reCompareString]',
})
export class CompareStringDirective implements OnChanges {
  @Input() reCompareString: string = '';
  @Input() matchColor: string = 'rgb(0, 150, 152)';
  @Input() wrongColor: string = 'rgb(215, 31, 75)';

  constructor(private el: ElementRef) {
  }

  ngOnChanges(): void {
    setTimeout(() => this.highlight(), 0);
  }

  highlight(): void {
    const text = this.el.nativeElement.textContent.trim();
    const children = text
      .split('')
      .map((c: string, i: number) => {
        const spanEl = document.createElement('span');
        spanEl.textContent = c;
        if (c === this.reCompareString[i]) {
          spanEl.style.color = this.matchColor;
        } else {
          spanEl.style.color = this.wrongColor;
        }
        return spanEl;
      });
    this.el.nativeElement.textContent = '';
    children.forEach((child: HTMLElement) => {
      this.el.nativeElement.appendChild(child);
    });
  }
}
