import { Component, OnInit, ViewChild } from '@angular/core';
import { AppStateStoreService, StateStore, DEFAULT_STATE, STATE_ATTRIBS } from 'src/app/controllers/app-state-store.service';
import { TextFieldComponent } from 'src/app/components/text-field/text-field.component';
import { Response } from 'src/app/utils/response';
import { ProfileSettingsComponent } from './profile-settings.component';
import { MatTabGroup } from '@angular/material/tabs';
import { UserStoreService } from 'src/app/models/user-store.service';
import { PreferenceSettingsComponent } from './preference-settings.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  ATTRIBS = STATE_ATTRIBS;
  currState: StateStore = DEFAULT_STATE;
  changes = false;
  changePassword = false;
  displayVerifyOverlay = false;
  displayAlert = false;
  alert: Response = new Response();
  profileUpdateList: {[key: string]: string } = {};
  preferencesUpdateList: {[key: string]: string | number} = {};
  PROFILE_IDX = 0;
  PREFERENCES_IDX = 1;
  tabChanges: {[key: number]: boolean} = {
    [this.PROFILE_IDX]: false, // profile changes
    [this.PREFERENCES_IDX]: false, // preferences changes
  };

  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  @ViewChild(ProfileSettingsComponent) profileSettingsComp: ProfileSettingsComponent;
  @ViewChild(PreferenceSettingsComponent) prefSettingsComp: PreferenceSettingsComponent;

  constructor(private stateStore: AppStateStoreService, private userStore: UserStoreService) { }

  ngOnInit() { }

  setChange(index: number, changeState: boolean) {
    this.tabChanges[index] = changeState;
    if (this.tabGroup.selectedIndex === index) {
      this.changes = this.tabChanges[index];
    }
  }

  saveChanges() {
    this.profileUpdateList = this.profileSettingsComp.updateList;
    this.preferencesUpdateList = this.prefSettingsComp.updateList;
    if (this.tabGroup.selectedIndex === this.PROFILE_IDX) {
      this.saveProfileChanges();
    } else if (this.tabGroup.selectedIndex === this.PREFERENCES_IDX) {
      this.savePreferencesChanges();
    }
    this.changes = this.tabChanges[this.tabGroup.selectedIndex];
  }

  async saveProfileChanges() {
    // changes propagated to UserStore
    // set change status based on success or failure
    const response = await this.userStore.updateUserAttributes(this.profileUpdateList);
    if (response.successful) {
      this.displayAlert = true;
      this.alert.success('Profile updates saved successfully!');
      if (this.profileSettingsComp.updateCheck.email) { // if email has been changed, display verification overlay
        this.profileSettingsComp.displayVerifyOverlay = true;
      }
      this.profileSettingsComp.updateCheck = Object.assign({}, DEFAULT_PROFILE_UPDATE_LIST);
      this.setChange(this.PROFILE_IDX, false);
    } else {
      this.displayAlert = true;
      this.alert.error(response.message);
    }
  }

  savePreferencesChanges() {
    // changes propagated to SettingsStore
  }

  showAlert(responseObject: Response) {
    this.alert = responseObject;
    this.displayAlert = true;
  }

  closeAlert() {
    this.displayAlert = false;
  }

}

export const DEFAULT_PROFILE_UPDATE_LIST = {
  given_name: false,
  family_name: false,
  email: false,
  password: false,
};

export const DEFAULT_PREFERENCES_UPDATE_LIST = {
  theme: false,
  palette: false,
}
