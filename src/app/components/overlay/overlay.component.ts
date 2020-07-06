import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-overlay',
  template:
    '\
    <div class="overlay-container">\
      <div class="overlay-inner-container">\
        <div class="header">\
          <p *ngIf="title" class="title">{{title}}</p>\
          <div class="spacer"></div>\
          <mat-icon class="close-btn" (click)="hideOverlay()">clear</mat-icon>\
        </div>\
        <ng-content style="padding: 0 20px;"></ng-content>\
      </div>\
    </div>',
  styleUrls: ['./overlay.component.css']
})
export class OverlayComponent implements OnInit {

  @Input() title = '';
  @Output() closeOverlay: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  hideOverlay() {
    this.closeOverlay.emit();
  }
}
