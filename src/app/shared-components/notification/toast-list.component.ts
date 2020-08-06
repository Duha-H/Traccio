import { Component, OnInit, Input } from "@angular/core";
import { Notification } from 'src/app/models/notification';
import { NotificationService } from 'src/app/controllers/notification.service';

@Component({
  selector: 'toast-list',
  template:
  '<div class="toast-list">\
    <toast *ngFor="let notification of notifications; let i = index;" [message]="notification" \
      (removeEvent)="notificationService.removeNotification(i)">\
    </toast>\
  </div>',
  styleUrls: ['toast.component.css'],
})
export class ToastListComponent implements OnInit {

  @Input() notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) { }

  ngOnInit() { }
}
