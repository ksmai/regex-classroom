import { Component } from '@angular/core';

/**
 * A footer for showing copyright information
 */
@Component({
  selector: 're-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  author = 'ksmai';
  year = (new Date()).getFullYear();
  github = 'https://github.com/ksmai/regex-classroom#regex-classroom';
}
