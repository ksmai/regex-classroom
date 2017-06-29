import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  title: string;
  content: string;
  yes: string;
  no: string;

  constructor(@Inject(MD_DIALOG_DATA) private data: any) {
    this.title = this.data.title || 'Are you sure?';
    this.content = this.data.content;
    this.yes = this.data.yes || 'YES';
    this.no = this.data.no || 'NO';
  }
}
