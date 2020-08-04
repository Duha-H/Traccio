import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Response } from 'src/app/utils/response';
import { ThemeManagerService } from './theme-manager.service';
import { PALETTES, THEMES, ThemeType, PaletteType } from 'src/styling/palettes';

@Injectable({
  providedIn: 'root'
})
export class PreferencesStoreService {

  private _preferences: BehaviorSubject<PreferencesType> = new BehaviorSubject<PreferencesType>(DEFAULT_PREFERENCES);
  public readonly preferences: Observable<PreferencesType> = this._preferences.asObservable();

  constructor(private themeManager: ThemeManagerService) {  }

  init(params?: {
    theme: string,
    palette: number,
    journeyInactive: number,
    appStale: number,
  }) {
    let currTheme;
    let currPalette;
    let journeyInactive;
    let appStale;
    if (params) {
      currTheme = params.theme;
      currPalette = params.palette;
      journeyInactive = params.journeyInactive;
      appStale = params.appStale;
    } else {
      currTheme = document.body.getAttribute('theme');
      currPalette = document.body.getAttribute('palette');
      journeyInactive = DEFAULT_PREFERENCES.journeyInactive;
      appStale = DEFAULT_PREFERENCES.appStale;
    }

    if (!currTheme || !THEMES[currTheme]) {
      console.log('PreferencesStore: encountered unsupported theme, resetting to:', DEFAULT_PREFERENCES.theme.name);
      currTheme = DEFAULT_PREFERENCES.theme.name;
    }
    if (!currPalette || !PALETTES[currPalette]) {
      console.log('PreferencesStore: encountered unsupported color palette, resetting to:', DEFAULT_PREFERENCES.colorPalette);
      currPalette = DEFAULT_PREFERENCES.colorPalette.id;
    }

    const currPreferences: PreferencesType = {
      theme: THEMES[currTheme],
      colorPalette: PALETTES[currPalette],
      journeyInactive,
      appStale,
    };
    this._preferences.next(currPreferences);
    this.reset();
  }

  reset() {
    // apply theme & palette settings based on current values
    this.updateTheme(this._preferences.getValue().theme.name);
    this.updatePalette(this._preferences.getValue().colorPalette.id);
  }

  updatePreferences(updates: {[key: string]: string}) {
    const response = new Response();
    const updatedPreferences = this._preferences.getValue();
    for (const attribute of Object.keys(updates)) {
      if (updatedPreferences[attribute]) {
        // apply changes
        if (attribute === 'theme') {
          this.updateTheme(updates[attribute]);
          updatedPreferences[attribute] = THEMES[updates[attribute]];
        } else if (attribute === 'colorPalette') {
          this.updatePalette(updates[attribute]);
          updatedPreferences[attribute] = PALETTES[updates[attribute]];
        }
      }
    }
    this._preferences.next(updatedPreferences);
    return response;
  }

  toggleTheme() {
    const updatedPreferences = this._preferences.getValue();
    if (this._preferences.getValue().theme.name === 'dark') {
      this.updateTheme('light');
      updatedPreferences.theme = THEMES.light;
    } else {
      this.updateTheme('dark');
      updatedPreferences.theme = THEMES.dark;
    }
    this._preferences.next(updatedPreferences);
  }

  updateTheme(theme: string) {
    if (!THEMES[theme]) {
      return;
    }
    const themeObject = THEMES[theme];
    this.themeManager.setTheme(themeObject);
  }

  updatePalette(palette: string) {
    if (!PALETTES[palette]) { // palette ID is invalid
      return;
    }
    const paletteObject = PALETTES[palette];
    this.themeManager.setPalette(paletteObject);
  }

}

export const DEFAULT_PREFERENCES: PreferencesType = {
  theme: THEMES.light,
  colorPalette: PALETTES['palette-3'],
  journeyInactive: 60,
  appStale: 90,
};

export interface PreferencesType {
  theme: ThemeType;
  colorPalette: PaletteType;
  journeyInactive: number;
  appStale: number;
}
