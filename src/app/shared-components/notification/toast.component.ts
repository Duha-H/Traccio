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
    // tslint:disable-next-line: max-line-length
    const test = 'this is a really really long message I just want to see what happens when I do this or try to make it super long and decide how I should handle that oh god the linter is already complaining about this long ass line and it\'s very annoying I hate that I have to skip apostrophes here ugh oh okay it looks like the height of the div just increases to accomodate additional text should I fix the height and truncate the text or just give it flexible height or an expandable layout';
    // this.message.message = test;
    if (this.message.message.length > 200) { // temp fix
      this.displayMessage = this.message.message.substr(0, 200) + '...';
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
      this.container.nativeElement.style.height = '90px';
      this.displayMessage = this.message.message.substr(0, 200) + '...';
    }
  }

}
