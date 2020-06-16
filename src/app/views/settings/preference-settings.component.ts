import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { DEFAULT_PREFERENCES_UPDATE_CHECK } from './constants';
import { PreferencesType, DEFAULT_PREFERENCES, PreferencesStoreService } from 'src/app/controllers/preferences-store.service';

@Component({
  selector: 'settings-preferences',
  templateUrl: './preference-settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class PreferenceSettingsComponent implements OnInit {

  updateList: {[key: string]: string | number} = {};
  updateCheck = Object.assign({}, DEFAULT_PREFERENCES_UPDATE_CHECK); // easier lookup for updated attribs
  preferences: PreferencesType = DEFAULT_PREFERENCES;

  @Output() updates: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private preferencesStore: PreferencesStoreService) { }

  ngOnInit() {
    this.preferencesStore.preferences.subscribe(preferences => {
      this.preferences = preferences;
      console.log('PreferenceSettings: preferences updated:', this.preferences);
    });
    this.toggleTheme(this.preferences.theme); // set currently active theme
  }

  addUpdate(updateAttrib: string, updateValue: string | number) {
    this.updates.emit(true);
    this.updateList[updateAttrib] = updateValue;
    this.updateCheck[updateAttrib] = true;
    this.preferences[updateAttrib] = updateValue;
  }

  toggleTheme(theme: 'dark' | 'light') {
    this.addUpdate('theme', theme);
  }
}
