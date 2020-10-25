import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Response } from 'src/app/utils/response';
import { ThemeManagerService } from './theme-manager.service';
import { PALETTES, THEMES, ThemeType, PaletteType } from 'src/styling/palettes';
import { UserStoreControllerService } from './user-store-controller.service';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class PreferencesStoreService {

  private _preferences: BehaviorSubject<PreferencesType> = new BehaviorSubject<PreferencesType>(DEFAULT_PREFERENCES);
  public readonly preferences: Observable<PreferencesType> = this._preferences.asObservable();
  userid: string;

  constructor(
    private themeManager: ThemeManagerService,
    private controller: UserStoreControllerService,
    private loaderService: LoaderService,
  ) {
    const storedTheme = localStorage.getItem('theme');
    const storedPalette = localStorage.getItem('palette');
    if (storedTheme
      && THEMES[storedTheme]
      && storedPalette
      && PALETTES[storedPalette]
    ) {
      this._preferences.next({
        theme: THEMES[storedTheme],
        colorPalette: PALETTES[storedPalette],
        journeyInactive: DEFAULT_PREFERENCES.journeyInactive,
        appStale: DEFAULT_PREFERENCES.appStale,
      });
    }
  }

  async init(userid: string) {
    let currTheme: string;
    let currPalette: string;
    let journeyInactive: number;
    let appStale: number;
    this.userid = userid;
    this.loaderService.setLoadingState(true);
    await this.controller.fetchPrefData(userid)
      .then(value => {
        currTheme = value.theme;
        currPalette = value.colorPalette;
        journeyInactive = value.journeyInactive;
        appStale = value.appStale;
      });

    if (!currTheme || !THEMES[currTheme]) {
      console.log('PreferencesStore: theme not specified or unsupported, resetting to:', DEFAULT_PREFERENCES.theme.name);
      currTheme = DEFAULT_PREFERENCES.theme.name;
    }
    if (!currPalette || !PALETTES[currPalette]) {
      console.log('PreferencesStore: color palette not specified or unsupported, resetting to:', DEFAULT_PREFERENCES.colorPalette);
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
    this.loaderService.setLoadingState(false);
  }

  reset() {
    // apply theme & palette settings based on current values
    const themeObject = THEMES[this._preferences.getValue().theme.name];
    this.themeManager.setTheme(themeObject);
    const paletteObject = PALETTES[this._preferences.getValue().colorPalette.id];
    this.themeManager.setPalette(paletteObject);
  }

  updatePreferences(updates: {[key: string]: string}) {
    const response = new Response();
    const updatedPreferences = this._preferences.getValue();
    for (const attribute of Object.keys(updates)) {
      if (updatedPreferences[attribute]) {
        // apply changes
        switch (attribute) {
          case 'theme':
            this.updateTheme(updates[attribute]);
            updatedPreferences[attribute] = THEMES[updates[attribute]];
            break;
          case 'colorPalette':
            this.updateTheme(updates[attribute]);
            updatedPreferences[attribute] = PALETTES[updates[attribute]];
            break;
          case 'journeyInactive':
            this.updateJourneyInactive(+updates[attribute]);
            updatedPreferences[attribute] = +updates[attribute];
            break;
          case 'appStale':
            this.updateAppStale(+updates[attribute]);
            updatedPreferences[attribute] = +updates[attribute];
            break;
          default:
            break;
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

  async updateTheme(theme: string) {
    if (!THEMES[theme]) {
      return;
    }
    await this.controller.updateTheme(this.userid, theme)
      .then(response => {
        if (response.successful) {
          const themeObject = THEMES[theme];
          this.themeManager.setTheme(themeObject);
        }
      });
    localStorage.setItem('theme', theme);
  }

  async updatePalette(palette: string) {
    if (!PALETTES[palette]) { // palette ID is invalid
      return;
    }
    await this.controller.updatePalette(this.userid, palette)
      .then(response => {
        if (response.successful) {
          const paletteObject = PALETTES[palette];
          this.themeManager.setPalette(paletteObject);
        }
      });
    localStorage.setItem('palette', palette);
  }

  async updateJourneyInactive(value: number) {
    await this.controller.updateJourneyInactive(this.userid, value);
  }

  async updateAppStale(value: number) {
    await this.controller.updateAppStale(this.userid, value);
  }

}

export const DEFAULT_PREFERENCES: PreferencesType = {
  theme: THEMES.light,
  colorPalette: PALETTES['palette-0'],
  journeyInactive: 60,
  appStale: 90,
};

export interface PreferencesType {
  theme: ThemeType;
  colorPalette: PaletteType;
  journeyInactive: number;
  appStale: number;
}
