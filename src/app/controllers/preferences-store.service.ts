import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
    palette: number
  }) {
    let currTheme;
    let currPalette;
    if (params) {
      currTheme = params.theme;
      currPalette = params.palette;
    } else {
      currTheme = document.body.getAttribute('theme');
      currPalette = document.body.getAttribute('palette');
    }

    if (!currTheme || !THEMES[currTheme]) {
      console.log('PreferencesStore: encountered unsupported theme, resetting to:', DEFAULT_PREFERENCES.theme.name);
      currTheme = DEFAULT_PREFERENCES.theme.name;
    }
    if (!currPalette || !PALETTES[currPalette]) {
      console.log('PreferencesStore: encountered unsupported color palette, resetting to:', DEFAULT_PREFERENCES.colorPalette);
      currPalette = DEFAULT_PREFERENCES.colorPalette.name;
    }

    const currPreferences: PreferencesType = {
      theme: THEMES[currTheme],
      colorPalette: PALETTES[currPalette]
    };
    this._preferences.next(currPreferences);
    this.reset();
  }

  reset() {
    // apply theme & palette settings based on current values
    this.updateTheme(this._preferences.getValue().theme.name);
    this.updatePalette(this._preferences.getValue().colorPalette.name);
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
  colorPalette: PALETTES['palette-2'],
};

export interface PreferencesType {
  theme: ThemeType;
  colorPalette: PaletteType;
}
