import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Response } from '../utils/response';
import { ThemeManagerService, THEMES } from './theme-manager.service';
import { PALETTES } from '../../styling/palettes';

@Injectable({
  providedIn: 'root'
})
export class PreferencesStoreService {

  private _preferences: BehaviorSubject<PreferencesType> = new BehaviorSubject<PreferencesType>(DEFAULT_PREFERENCES);
  public readonly preferences: Observable<PreferencesType> = this._preferences.asObservable();

  constructor(private themeManager: ThemeManagerService) { }

  updatePreferences(updates: {[key: string]: string | number}) {
    const resopnse = new Response();
    const updatedPreferences = this._preferences.getValue();
    for (const attribute of Object.keys(updates)) {
      if (updatedPreferences[attribute]) {
        updatedPreferences[attribute] = updates[attribute];
        if (attribute === 'theme') {
          this.updateTheme(updates[attribute] as string);
        } else if (attribute === 'colorPalette') {
          this.updatePalette(updates[attribute] as number);
        }
      }
    }
    this._preferences.next(updatedPreferences);
    return resopnse;
  }

  updateTheme(theme: string) {
    if (!THEMES[theme]) {
      return;
    }
    console.log('PreferencesStore: updating theme:', theme);
    this.themeManager.setTheme(theme);
  }

  updatePalette(palette: number) {
    if (!PALETTES[palette]) { // palette ID is invalid
      return;
    }
    console.log('PreferencesStore: updating palette:', palette);
    this.themeManager.setPalette(palette);
  }

}

export const DEFAULT_PREFERENCES: PreferencesType = {
  theme: 'light',
  colorPalette: 0,
};

export interface PreferencesType {
  theme: 'dark' | 'light';
  colorPalette: 0 | 1 | 2 | 3;
}
