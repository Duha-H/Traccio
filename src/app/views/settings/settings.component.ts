import { Component, OnInit, ViewChild } from '@angular/core';
import { AppStateStoreService, StateStore, DEFAULT_STATE, STATE_ATTRIBS } from 'src/app/controllers/app-state-store.service';
import { Response } from 'src/app/utils/response';
import { ProfileSettingsComponent } from './profile-settings.component';
import { MatTabGroup } from '@angular/material/tabs';
import { UserStoreService } from 'src/app/models/user-store.service';
import { PreferenceSettingsComponent } from './preference-settings.component';
import { DEFAULT_PROFILE_UPDATE_CHECK, DEFAULT_PREFERENCES_UPDATE_CHECK } from './constants';
import { PreferencesStoreService } from 'src/app/controllers/preferences-store.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  ATTRIBS = STATE_ATTRIBS;
  changes = false;
  changePassword = false;
  displayVerifyOverlay = false;
  displayAlert = false;
  alert: Response = new Response();
  profileUpdateList: {[key: string]: string } = {};
  preferencesUpdateList: {[key: string]: string} = {};
  PROFILE_IDX = 0;
  PREFERENCES_IDX = 1;
  tabChanges: {[key: number]: boolean} = {
    [this.PROFILE_IDX]: false, // profile changes
    [this.PREFERENCES_IDX]: false, // preferences changes
  };

  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  @ViewChild(ProfileSettingsComponent) profileSettingsComp: ProfileSettingsComponent;
  @ViewChild(PreferenceSettingsComponent) prefSettingsComp: PreferenceSettingsComponent;

  constructor(
    private userStore: UserStoreService,
    private preferencesStore: PreferencesStoreService,
  ) { }

  ngOnInit() { }

  setChange(index: number, changeState: boolean) {
    this.tabChanges[index] = changeState;
    if (this.tabGroup && this.tabGroup.selectedIndex === index) {
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
      this.alert.success('Profile updates saved successfully!');
      this.showAlert();
      if (this.profileSettingsComp.updateCheck.email) { // if email has been changed, display verification overlay
        this.profileSettingsComp.displayVerifyOverlay = true;
      }
      this.profileSettingsComp.updateCheck = Object.assign({}, DEFAULT_PROFILE_UPDATE_CHECK);
      this.setChange(this.PROFILE_IDX, false);
    } else {
      this.alert.error(response.message);
      this.showAlert();
    }
  }

  savePreferencesChanges() {
    // changes propagated to SettingsStore
    this.preferencesStore.updatePreferences(this.preferencesUpdateList);
    this.prefSettingsComp.updateCheck = Object.assign({}, DEFAULT_PREFERENCES_UPDATE_CHECK);
    this.setChange(this.PREFERENCES_IDX, false);
    this.alert.success('Preferences updated successfully!');
    this.showAlert();
  }

  showAlert(responseObject?: Response) {
    this.alert = responseObject ? responseObject : this.alert;
    this.displayAlert = true;
    if (this.alert.successful) { // if successful, hide alert after 5 seconds
      setTimeout(() => {
        this.closeAlert();
      }, 5000);
    }
  }

  closeAlert() {
    this.displayAlert = false;
  }

}
