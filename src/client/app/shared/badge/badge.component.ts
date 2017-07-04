import { Component, HostBinding, Input, OnChanges } from '@angular/core';

/**
 * A simple wrapper around the badge svg with some stylings
 */
@Component({
  selector: 're-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
})
export class BadgeComponent implements OnChanges {
  @Input() level: number;
  @Input() type: string;
  @Input() locked: boolean;
  tooltip: string = 'A badge';
  classes: { [key: string]: boolean };

  ngOnChanges(): void {
    this.tooltip = this.getTooltip();
    this.classes = { badge: true };
    if (this.level >= 0) {
      this.classes[`badge--level-${this.level}`] = true;
    }
    if (this.type) {
      this.classes[`badge--type-${this.type}`] = true;
    }
    if (this.locked) {
      this.classes['badge--locked'] = true;
    }
  }

  private getTooltip(): string {
    switch (this.type) {
      case 'a':
        return `Reward for beating Alice in level ${this.level}`;
      case 'b':
        return `Reward for beating Bob in level ${this.level}`;
      default:
        return this.tooltip;
    }
  }
}
