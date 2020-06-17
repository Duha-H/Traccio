import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef, OnDestroy } from '@angular/core';
import { DEFAULT_PREFERENCES_UPDATE_CHECK } from './constants';
import { PreferencesType, DEFAULT_PREFERENCES, PreferencesStoreService } from 'src/app/controllers/preferences-store.service';
import { ThemeManagerService } from 'src/app/controllers/theme-manager.service';
import { THEMES, PALETTES } from 'src/styling/palettes';
import { Response } from 'src/app/utils/response';

@Component({
  selector: 'settings-preferences',
  templateUrl: './preference-settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class PreferenceSettingsComponent implements OnInit, OnDestroy {

  updateList: {[key: string]: string} = {};
  updateCheck = Object.assign({}, DEFAULT_PREFERENCES_UPDATE_CHECK); // easier lookup for updated attribs
  preferences: PreferencesType = DEFAULT_PREFERENCES;

  @Output() updates: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() showAlert: EventEmitter<Response> = new EventEmitter<Response>();

  constructor(
    private prefStore: PreferencesStoreService,
    private themeManager: ThemeManagerService
  ) {  }

  ngOnInit() {
    this.prefStore.preferences.subscribe(preferences => {
      this.preferences = Object.assign({}, preferences);
    });
  }

  ngOnDestroy() {
    this.prefStore.reset();
  }

  addUpdate(updateAttrib: string, updateValue: string) {
    this.updates.emit(true);
    this.updateList[updateAttrib] = updateValue;
    this.updateCheck[updateAttrib] = true;

    this._applyTemporaryUpdate(updateAttrib, updateValue);
  }

  toggleTheme(theme: string) {
    this.addUpdate('theme', theme);
  }

  private _applyTemporaryUpdate(attribute: string, value: string) {
    if (attribute === 'theme') {
      this.prefStore.updateTheme(value);
      this.preferences[attribute] = THEMES[value];
    } else if (attribute === 'colorPalette') {
      this.prefStore.updatePalette(value);
      this.preferences[attribute] = PALETTES[value];
    }
    const response = new Response();
    response.error('Applied changes are not saved yet.');
    this.showAlert.emit(response);
  }
}
