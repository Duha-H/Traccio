import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Notification } from 'src/app/models/notification';
import { ResizeService } from 'src/app/controllers/resize.service';

@Component({
  selector: 'toast',
  template:
  '<div class="notif-container"\
    style="top: {{ (rs.mobileSize$ | async) ? (index * 15) : 0 }}px;"\
    #container>\
    <div class="header">\
      <div class="spacer"></div>\
      <mat-icon class="header-btn" *ngIf="displayExpansionIcon" (click)="toggleExpansion()">\
        {{ expanded ? \'expand_more\' : \'expand_less\' }}\
      </mat-icon>\
      <mat-icon class="header-btn" (click)="removeNotification()">clear</mat-icon>\
    </div>\
    <p>{{ displayMessage }}</p>\
  </div>',
  styleUrls: ['toast.component.css']
})
export class ToastComponent implements OnInit {

  expanded = false;
  displayMessage = '';
  displayExpansionIcon = true;

  @Input() message: Notification;
  @Input() index: number;
  @Output() removeEvent: EventEmitter<any> = new EventEmitter();
  @ViewChild('container', { static: true }) container: ElementRef<any>;

  constructor(public rs: ResizeService) { }

  ngOnInit() {
    if (!this.message) {
      throw new TypeError('NotificationComponent: no input message specified');
    }
    if (this.message.message.length > TRUNCATED_LENGTH) { // temp fix
      this.displayMessage = this.message.message.substr(0, TRUNCATED_LENGTH) + '...';
    } else {
      this.displayMessage = this.message.message;
      this.displayExpansionIcon = false;
    }

    if (this.message.type === 'success') {
      this.container.nativeElement.style.border = '1px solid var(--valid)';
    } else if (this.message.type === 'error') {
      this.container.nativeElement.style.border = '1px solid var(--warn)';
    }
  }

  removeNotification() {
    this.removeEvent.emit();
  }

  toggleExpansion() {
    this.expanded = !this.expanded;
    if (this.expanded) {
      this.container.nativeElement.style.height = 'auto';
      this.displayMessage = this.message.message;
    } else {
      this.container.nativeElement.style.height = '85px';
      this.displayMessage = this.message.message.substr(0, TRUNCATED_LENGTH) + '...';
    }
  }

  bringToFront(newIndex: number) {
    this.container.nativeElement.style.zIndex = newIndex;
  }

}

const TRUNCATED_LENGTH = 175;
