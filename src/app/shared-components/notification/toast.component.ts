import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Notification } from 'src/app/models/notification';

@Component({
  selector: '<toast></toast>',
  template:
  '<div class="notif-container" #container>\
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
  @Output() removeEvent: EventEmitter<any> = new EventEmitter();
  @ViewChild('container') container: ElementRef<any>;

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

}

const TRUNCATED_LENGTH = 175;