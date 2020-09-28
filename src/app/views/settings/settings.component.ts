import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Response } from 'src/app/utils/response';
import { ProfileSettingsComponent } from './profile-settings.component';
import { MatTabGroup } from '@angular/material/tabs';
import { UserStoreService } from 'src/app/models/user-store.service';
import { PreferenceSettingsComponent } from './preference-settings.component';
import { DEFAULT_PROFILE_UPDATE_CHECK, DEFAULT_PREFERENCES_UPDATE_CHECK } from './constants';
import { PreferencesStoreService } from 'src/app/controllers/preferences-store.service';
import { ResizeService } from 'src/app/controllers/resize.service';
import { NotificationService } from 'src/app/controllers/notification.service';
import { AuthWrapperService } from 'src/app/auth/auth-wrapper.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    "(document:click)": "onViewClick($event)",
  },
})
export class SettingsComponent implements OnInit {

  changes = false;
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
  visibleTooltip: ElementRef = undefined;
  clickedIcon: EventTarget = undefined;
  mostRecentAlertId = -1;

  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  @ViewChild(ProfileSettingsComponent) profileSettingsComp: ProfileSettingsComponent;
  @ViewChild(PreferenceSettingsComponent) prefSettingsComp: PreferenceSettingsComponent;

  constructor(
    private userStore: UserStoreService,
    private preferencesStore: PreferencesStoreService,
    public rs: ResizeService,
    private notificationService: NotificationService,
    private authWrapper: AuthWrapperService,
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
      if (this.profileSettingsComp.updateCheck.email) { // if email has been changed, display verification overlay
        this.profileSettingsComp.displayVerifyOverlay = true;
      }
      this.profileSettingsComp.updateCheck = Object.assign({}, DEFAULT_PROFILE_UPDATE_CHECK);
      this.setChange(this.PROFILE_IDX, false);
    } else {
      this.alert.error(response.message);
    }
    this.showAlert();
  }

  savePreferencesChanges() {
    // changes propagated to SettingsStore
    this.preferencesStore.updatePreferences(this.preferencesUpdateList);
    this.prefSettingsComp.updateCheck = Object.assign({}, DEFAULT_PREFERENCES_UPDATE_CHECK);
    this.setChange(this.PREFERENCES_IDX, false);
    this.alert.success('Preferences updated successfully!');
    this.showAlert();
  }

  async applyPasswordChange(passwordDetails: {
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  }) {
    const response = await this.authWrapper.changePassword(
      passwordDetails.oldPassword,
      passwordDetails.newPassword,
      passwordDetails.confirmPassword
    );
    if (response.successful) {
      this.alert.success('Password changed successfully!');
      this.profileSettingsComp.resetPasswordChange();
    } else {
      this.alert = response;
    }
    this.showAlert();
  }

  showAlert(responseObject?: Response) {
    this.alert = responseObject ? responseObject : this.alert;
    const type = this.alert.successful ? 'success' : 'error';
    const duration = this.alert.successful ? 5000 : 15000;
    const mostRecentAlert = this.notificationService.getMostRecent();
    if (this.alert.successful ||
        (mostRecentAlert && this.alert.message === mostRecentAlert.message)) {
      // if current alert is successful (everything is fine/resolved)
      // or the previous alert is exactly the same
      // hide the previous alert
      this.notificationService.removeNotification(this.mostRecentAlertId);
    }
    this.mostRecentAlertId = this.notificationService.sendNotification(this.alert.message, type, duration);
  }

  closeAlert() {
    this.displayAlert = false;
  }

  showTooltip(input: {
    tooltip: ElementRef,
    event: MouseEvent
  }) {
    if (this.visibleTooltip) {
      this.hideTooltip(this.visibleTooltip); // hide already-visible tooltip
    }
    this.visibleTooltip = input.tooltip;
    this.clickedIcon = input.event.target;
    this.visibleTooltip.nativeElement.style.top = `${input.event.y + 10}px`;
    this.visibleTooltip.nativeElement.style.left = `${input.event.x + 10}px`;
    this.visibleTooltip.nativeElement.className += ' visible';
  }

  hideTooltip(tooltip: ElementRef) {
    tooltip.nativeElement.className = 'info';
    clearTimeout();
  }

  onViewClick(event: MouseEvent) {
    if (this.visibleTooltip &&
        !this.visibleTooltip.nativeElement.contains(event.target) &&
        this.clickedIcon !== event.target
    ) {
      // console.log('hiding ittt');
      this.hideTooltip(this.visibleTooltip);
    }
  }

}
