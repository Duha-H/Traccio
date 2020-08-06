import { Injectable } from '@angular/core';
import { Notification } from 'src/app/models/notification';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map } from "rxjs/operators/map";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  // tslint:disable-next-line: max-line-length
  test = 'This is a really really long message I just want to see what happens when I do this or try to make it super long and decide how I should handle that oh god the linter is already complaining about this long ass line and it\'s very annoying I hate that I have to skip apostrophes here ugh oh okay it looks like the height of the div just increases to accomodate additional text should I fix the height and truncate the text or just give it flexible height or an expandable layout';
  test2 = 'Beep boop short message';
  // tslint:disable-next-line: max-line-length
  test3 = 'Replay All is hosted by PJ Vogt and me, Alex Goldman. Producing help this week from Sruthi Pinnamaneni and Damiano Marchetti. Our music is by the Mysterious Breakmaster Cylinder. Special thanks to Donna Someone and Richard Gill. Matt Lieber is like an ice-cream sundae at 3AM on a lonely Saturday night. You can listen to our show on Spotify or wherever you get your podcasts. Thanks for listening, we\'ll see you in two weeks.';
  private _messages: BehaviorSubject<{
    [key: string]: Notification;
  }> = new BehaviorSubject<{ [key: string]: Notification }>({});
  messages: Observable<Notification[]> = this._messages.pipe(
    map(entry => Object.values(entry))
  );
  nextAvailableKey = 0;

  constructor() {
    // this.sendNotification(this.test);
    // this.sendNotification(this.test2, 'success');
    // this.sendNotification(this.test3, 'error');
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
      if (!duration) { duration = 15000; }
      setTimeout(() => this.removeNotification(key), duration); // remove notification in a 10 seconds?
    }
    this.nextAvailableKey++;
  }

  removeNotification(key: number) {
    const updatedList = this._messages.getValue();
    if (updatedList[key] !== undefined) {
      delete updatedList[key];
      this._messages.next(updatedList);
    }
  }

  keyboardHandler(event: KeyboardEvent) {
    if (event.keyCode === 77) {
      const message = Math.random() * 30 + ' NEW MESSAGE';
      this.sendNotification(message);
    }
  }

}
