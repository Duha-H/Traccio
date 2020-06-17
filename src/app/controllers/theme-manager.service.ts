import { Injectable } from '@angular/core';
import { PALETTES } from '../../styling/palettes';

/**
 * Handles applying theme and palette changes
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeManagerService {

  constructor() { }

  setTheme(theme: string) {
    if (!THEMES[theme]) {
      console.log('ThemeManager: unsupported theme:', theme);
      return;
    }
    console.log('ThemeManager: new theme:', theme);
    document.body.setAttribute('theme', theme);
  }

  setPalette(colorPalette: number) {
    if (!PALETTES[colorPalette]) {
      console.log('ThemeManager: unsupported palette:', colorPalette);
      return;
    }
    console.log('ThemeManager: new palette:', colorPalette);
    document.body.setAttribute('palette', `palette-${colorPalette}`);
  }
}

export const THEMES = {
  dark: 'dark',
  light: 'light'
};
