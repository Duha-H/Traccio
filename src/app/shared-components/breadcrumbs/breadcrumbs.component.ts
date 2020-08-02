import { Component, OnInit, Input } from '@angular/core';
import { BreadcrumbsData } from '../types';

@Component({
  selector: 'breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit {

  @Input() data: BreadcrumbsData;

  constructor() { }

  ngOnInit() {
    if (!this.data) {
      throw new TypeError('BreadcrumbsComponent: No breadcrumbs data specified.');
    }
    this._validateInput();
  }

  private _validateInput() {
    if (!this.data.current.url.startsWith('/')) {
      this.data.current.url = `/${this.data.current.url}`;
    }
    this.data.paths.forEach(item => {
      if (!item.url.startsWith('/')) {
        item.url = `/${item.url}`;
      }
    });
  }

}
