import { Injectable } from '@angular/core';
import { Notification } from 'src/app/models/notification';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  // tslint:disable-next-line: max-line-length
  test = 'This is a really really long message I just want to see what happens when I do this or try to make it super long and decide how I should handle that oh god the linter is already complaining about this long ass line and it\'s very annoying I hate that I have to skip apostrophes here ugh oh okay it looks like the height of the div just increases to accomodate additional text should I fix the height and truncate the text or just give it flexible height or an expandable layout';
  placeholderNotification = new Notification(this.test);
  private _messages: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([this.placeholderNotification]);
  messages: Observable<Notification[]> = this._messages.asObservable();

  constructor() {
    // console.log(this._messages.getValue());
  }

  sendNotification(message: string, type?: 'standard' | 'success' | 'error') {
    const newNotification = new Notification(message, type);
    this._messages.next(this._messages.getValue().concat([newNotification]));
  }

  removeNotification(index: number) {
    const updatedList = this._messages.getValue().filter((_, idx) => index !== idx );
    this._messages.next(updatedList);
  }

}
