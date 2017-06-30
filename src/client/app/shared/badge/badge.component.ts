import { Component, Input, OnChanges } from '@angular/core';

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
  fgColor: string = '#fff';
  bgColor: string = '#333';
  tooltip: string = 'Badge';

  ngOnChanges(): void {
    this.fgColor = this.getFgColor();
    this.bgColor = this.getBgColor();
    this.tooltip = this.getTooltip();
  }

  private getTooltip(): string {
    switch (this.type) {
      case 'a':
        return `Reward for beating Alice in level ${this.level + 1}`;
      case 'b':
        return `Reward for beating Bob in level ${this.level + 1}`;
      default:
        return this.tooltip;
    }
  }

  private getFgColor(): string {
    switch (this.type) {
      case 'a':
        return '#f44336';
      case 'b':
        return '#ffd740';
      default:
        return this.fgColor;
    }
  }

  private getBgColor(): string {
    switch (this.level) {
      case 0:
        return 'rgb(0, 59, 255)';
      case 1:
        return 'rgb(180, 161, 211)';
      case 2:
        return 'rgb(168, 85, 58)';
      case 3:
        return 'rgb(48, 108, 103)';
      case 4:
        return 'rgb(124, 213, 186)';
      case 5:
        return 'rgb(100, 88, 76)';
      case 6:
        return 'rgb(104, 160, 165)';
      case 7:
        return 'rgb(122, 24, 24)';
      case 8:
        return 'rgb(205, 204, 200)';
      case 9:
        return 'rgb(234, 133, 100)';
      default:
        return this.bgColor;
    }
  }
}
