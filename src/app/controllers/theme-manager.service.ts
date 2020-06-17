import { Injectable } from '@angular/core';
import { PALETTES, THEMES, ThemeType, PaletteType } from 'src/styling/palettes';

/**
 * Handles applying theme and palette changes
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeManagerService {

  constructor() { }

  setTheme(theme: ThemeType) {
    if (!THEMES[theme.name]) {
      console.log('ThemeManager: unsupported theme:', theme.name);
      return;
    }
    document.body.setAttribute('theme', theme.name);
  }

  setPalette(colorPalette: PaletteType) {
    if (!PALETTES[colorPalette.name]) {
      console.log('ThemeManager: unsupported palette:', colorPalette.name);
      return;
    }
    document.body.setAttribute('palette', colorPalette.name);
  }
}
