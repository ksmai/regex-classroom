import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';

/**
 * Show the summary statistics after learning
 */
@Component({
  templateUrl: './summary-dialog.component.html',
  styleUrls: ['./summary-dialog.component.scss'],
})
export class SummaryDialogComponent implements OnInit {
  title: string;
  header: string;
  footer: string;
  nHit: number;
  nMiss: number;
  hitRate: number;
  missRate: number;
  averageTime: string|number;

  constructor(@Inject(MD_DIALOG_DATA) private data: any) {
  }

  ngOnInit(): void {
    this.title = this.data.title;
    this.header = this.data.header;
    this.footer = this.data.footer;
    this.nHit = this.data.nHit;
    this.nMiss = this.data.nMiss;

    const total = this.data.nHit + this.data.nMiss;
    if (total === 0) {
      this.hitRate = 0;
      this.missRate = 0;
      this.averageTime = 0;
    } else {
      this.hitRate = Math.round(100 * this.data.nHit / total);
      this.missRate = Math.round(100 * this.data.nMiss / total);
      this.averageTime = (this.data.time / total / 1000).toFixed(2);
    }
  }
}
