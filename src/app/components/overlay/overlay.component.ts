import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-overlay',
  template:
    '\
    <div class="overlay-container">\
      <div class="overlay-content">\
        <div style="margin-bottom: 20px; height: 20px;">\
          <mat-icon class="close-btn" (click)="hideOverlay()">clear</mat-icon>\
        </div>\
        <ng-content style="padding: 0 20px;"></ng-content>\
      </div>\
    </div>',
  styleUrls: ['./overlay.component.css']
})
export class OverlayComponent implements OnInit {

  @Output() closeOverlay: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  hideOverlay() {
    this.closeOverlay.emit();
  }
}
