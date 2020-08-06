import { Component, OnInit, Input, ElementRef } from "@angular/core";
import { Notification } from 'src/app/models/notification';
import { NotificationService } from 'src/app/controllers/notification.service';
import { ToastComponent } from './toast.component';
import { ResizeService } from 'src/app/controllers/resize.service';

@Component({
  selector: 'toast-list',
  template:
  '<div class="toast-list">\
    <toast *ngFor="let notification of notifications; let i = index;"\
      [index]="i"\
      [message]="notification" \
      (removeEvent)="notificationService.removeNotification(notification.id)"\
      (click)="bringToFront(toast)"\
    #toast>\
    </toast>\
  </div>',
  styleUrls: ['toast.component.css'],
})
export class ToastListComponent implements OnInit {

  @Input() notifications: Notification[] = [];
  currHighestIndex = 5;

  constructor(public notificationService: NotificationService, private rs: ResizeService) { }

  ngOnInit() { }

  bringToFront(element: ToastComponent) {
    if (this.rs.mobileSize$.value) {
      this.currHighestIndex++;
      element.bringToFront(this.currHighestIndex);
    }
  }
}
