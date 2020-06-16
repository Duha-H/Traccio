import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Response } from '../utils/response';

@Injectable({
  providedIn: 'root'
})
export class PreferencesStoreService {

  private _preferences: BehaviorSubject<PreferencesType> = new BehaviorSubject<PreferencesType>(DEFAULT_PREFERENCES);
  public readonly preferences: Observable<PreferencesType> = this._preferences.asObservable();

  constructor() { }

  updatePreferences(updates: {[key: string]: string | number}) {
    const resopnse = new Response();
    const updatedPreferences = this._preferences.getValue();
    for (const attribute of Object.keys(updates)) {
      if (updatedPreferences[attribute]) {
        updatedPreferences[attribute] = updates[attribute];
      }
    }
    this._preferences.next(updatedPreferences);
    return resopnse;
  }

}

export const DEFAULT_PREFERENCES: PreferencesType = {
  theme: 'dark',
  colorPalette: 0,
};

export interface PreferencesType {
  theme: 'dark' | 'light';
  colorPalette: 0 | 1 | 2 | 3;
}
