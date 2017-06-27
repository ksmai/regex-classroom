import { Component, Input, ViewChild } from '@angular/core';

@Component({
  selector: 're-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent {
  @ViewChild('body') private body: any;
  private height: number;

  toggleOpen(): void {
  }
}
