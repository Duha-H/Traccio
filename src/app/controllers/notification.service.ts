import { Injectable } from '@angular/core';
import { Notification } from 'src/app/models/notification';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map } from "rxjs/operators/map";
import { MESSAGES } from 'src/assets/template-messages';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private _messages: BehaviorSubject<{
    [key: string]: Notification;
  }> = new BehaviorSubject<{ [key: string]: Notification }>({});
  messages: Observable<Notification[]> = this._messages.pipe(
    map(entry => Object.values(entry))
  );
  nextAvailableKey = 0;

  constructor() {
    window.addEventListener('keydown', (event) => this.keyboardHandler(event));
  }

  sendNotification(message: string, type?: 'standard' | 'success' | 'error', duration?: number) {
    const key = this.nextAvailableKey;
    const newNotification = new Notification(key, message, type);
    this._messages.next({
      ...this._messages.getValue(),
      [this.nextAvailableKey]: newNotification,
    });
    if (type !== 'error') {
      if (!duration) { duration = 5000; }
      setTimeout(() => this.removeNotification(key), duration); // remove notification in {duration} seconds
    }
    this.nextAvailableKey++;
    return key; // return message id for sender's reference
  }

  removeNotification(key: number) {
    const updatedList = this._messages.getValue();
    if (updatedList[key] !== undefined) {
      delete updatedList[key];
      this._messages.next(updatedList);
    }
  }

  getMostRecent() {
    return this._messages.getValue()[this.nextAvailableKey - 1];
  }

  keyboardHandler(event: KeyboardEvent) {
    // if (event.key === 'm') { // just for testing
    //   const message = Math.random() * 30 + ' NEW MESSAGE';
    //   this.sendNotification(message);
    // }
  }

}
