import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/pluck';
import { Observable } from 'rxjs/Observable';

import { ILevel } from '../core/level.service';

/**
 * Display all the levels, with their questions/answers
 */
@Component({
  templateUrl: './cheatsheet.component.html',
  styleUrls: ['./cheatsheet.component.scss'],
})
export class CheatsheetComponent implements OnInit {
  levelList$: Observable<ILevel[]>;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.levelList$ = this.route.data.pluck('levels');
  }
}
