import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef, OnDestroy } from '@angular/core';
import { DEFAULT_PREFERENCES_UPDATE_CHECK } from './constants';
import { PreferencesType, DEFAULT_PREFERENCES, PreferencesStoreService } from 'src/app/controllers/preferences-store.service';
import { ThemeManagerService } from 'src/app/controllers/theme-manager.service';
import { THEMES, PALETTES } from 'src/styling/palettes';
import { Response } from 'src/app/utils/response';
import { KeyValue } from '@angular/common';
import { TextFieldComponent } from 'src/app/shared-components/text-field/text-field.component';

@Component({
  selector: 'settings-preferences',
  templateUrl: './preference-settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class PreferenceSettingsComponent implements OnInit, OnDestroy {

  updateList: {[key: string]: string} = {};
  updateCheck = Object.assign({}, DEFAULT_PREFERENCES_UPDATE_CHECK); // easier lookup for updated attribs
  preferences: PreferencesType = DEFAULT_PREFERENCES;
  visibleTooltip: ElementRef = undefined;
  palettes = PALETTES;

  @Output() updates: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() showAlert: EventEmitter<Response> = new EventEmitter<Response>();
  @Output() showTooltip: EventEmitter<object> = new EventEmitter<object>();
  @Output() hideTooltip: EventEmitter<ElementRef> = new EventEmitter<ElementRef>();

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

  undoChange(updateAttrib: string, field: TextFieldComponent) {
    field.resetValue();
    delete this.updateList[updateAttrib];
    this.updateCheck[updateAttrib] = false;
    if (Object.keys(this.updateList).length === 0) {
      this.updates.emit(false);
    }
  }

  toggleTheme(theme: string) {
    this.addUpdate('theme', theme);
  }

  displayTooltip(id: string, event: MouseEvent) {
    const tooltip = new ElementRef(document.getElementById(id));
    this.showTooltip.emit({
      tooltip,
      event
    });
    setTimeout(() => {
      this.hideTooltip.emit(tooltip);
    }, 8000);
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
    response.error('Applied changes are not saved yet');
    this.showAlert.emit(response);
  }

  /**
   * KeyValue pipe ordering by entry
   */
  originalOrder(a: KeyValue<number, string>, b: KeyValue<number, string>): number {
    return 0;
  }
}
