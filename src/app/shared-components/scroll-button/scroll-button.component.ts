import { Component, Input, OnInit } from "@angular/core";

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'scroll-button',
  template: `<button (click)="onClick()">
    <mat-icon>{{ direction == 'top' ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</mat-icon>
  </button>`,
  styleUrls: ['./scroll-button.component.css'],
})
export class ScrollButtonComponent implements OnInit {

  @Input() direction: 'top' | 'bottom' = 'top';
  @Input() targetId = '#top-marker';

  ngOnInit() { }

  onClick() {
    let scrollMarker: Element;
    if (this.targetId) {
      if (this.targetId.startsWith('#')) {
        scrollMarker = document.querySelector(this.targetId);
      } else {
        scrollMarker = document.querySelector(`#${this.targetId}`);
      }
    } else {
      scrollMarker = document.querySelector('#top-marker');
    }
    scrollMarker.scrollIntoView({ behavior: 'smooth', });
  }

}
