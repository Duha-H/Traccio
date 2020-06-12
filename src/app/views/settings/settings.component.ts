import { Component, OnInit, ViewChild } from '@angular/core';
import { AppStateStoreService, StateStore, DEFAULT_STATE, STATE_ATTRIBS } from 'src/app/controllers/app-state-store.service';
import { TextFieldComponent } from 'src/app/components/text-field/text-field.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  ATTRIBS = STATE_ATTRIBS;
  currState: StateStore = DEFAULT_STATE;
  updateValues: {[key: string]: string | number} = {};
  updateList = Object.assign({}, DEFAULT_UPDATE_LIST); // easier lookup for updated attribs
  changes = false;
  changePassword = false;
  PASSWORD = {
    OLD: 'old',
    NEW: 'new',
    CONFIRM: 'confirm',
  };

  constructor(private stateStore: AppStateStoreService) { }

  ngOnInit() {
    this.stateStore.state.subscribe(value => {
      this.currState = value;
    });
  }

  addUpdate(updateAttrib: string, updateValue: string | number) {
    this.changes = true;
    this.updateValues[updateAttrib] = updateValue;
    this.updateList[updateAttrib] = true;
  }

  saveChanges() {
    try {
      this.stateStore.updateAttributes(this.updateValues);
      this.changes = false;
      this.updateList = Object.assign({}, DEFAULT_UPDATE_LIST);
    } catch (error) {
      console.error("Changes not stored:", error);
    }
  }

  undoChange(updateAttrib: string, field: TextFieldComponent) {
    // console.log(this.currState[updateAttrib], field);
    field.resetValue();
    delete this.updateValues[updateAttrib];
    this.updateList[updateAttrib] = false;
    if (Object.keys(this.updateValues).length === 0) {
      this.changes = false;
    }
  }

  toggleChangePassword() {
    this.changePassword = !this.changePassword;
  }

  addPasswordChange(category: string, value: string) {

  }

}

const DEFAULT_UPDATE_LIST = {
  given_name: false,
  family_name: false,
  email: false,
  password: false,
  theme: false,
  palette: false,
};
