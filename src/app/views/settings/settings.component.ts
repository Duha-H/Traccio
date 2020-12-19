import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
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
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { containsLowercaseValidator, containsNumberValidator, containsUppercaseValidator } from 'src/app/utils/validators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    "(document:click)": "onViewClick($event)",
  },
})
export class SettingsComponent implements OnInit, AfterViewInit, OnDestroy {

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
  routeSub: Subscription;
  displayPasswordPrompt = false;
  displayEmailPrompt = false;
  displayPasswordChangeOverlay = false;
  password = new FormControl('', [
    Validators.required,
  ]);
  newPassword = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    containsUppercaseValidator(), // atleast one upper-case letter
    containsLowercaseValidator(), // atleast one lower-case letter
    containsNumberValidator(), // atleast one number
  ]);
  confirmPassword = new FormControl('', [
    Validators.required,
  ]);
  email = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFocus = false;

  @ViewChild('tabGroup', { read: MatTabGroup }) tabGroup: MatTabGroup;
  @ViewChild(ProfileSettingsComponent) profileSettingsComp: ProfileSettingsComponent;
  @ViewChild(PreferenceSettingsComponent) prefSettingsComp: PreferenceSettingsComponent;

  constructor(
    private userStore: UserStoreService,
    private preferencesStore: PreferencesStoreService,
    public rs: ResizeService,
    private notificationService: NotificationService,
    private authWrapper: AuthWrapperService,
    private titleService: Title,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Settings | Traccio');
  }

  ngAfterViewInit() {
    this.routeSub = this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.tabGroup.selectedIndex = params['tab'] === 'preferences' ? 1 : 0;
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  setChange(index: number, changeState: boolean) {
    // updates/sets the change state of the specified settings tab index
    // 'true' if there are unsaved changes, 'false' otherwise
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
    if (this.profileSettingsComp.updateCheck.email && Object.values(this.profileUpdateList).length === 1) { // if (only) email has been changed, display verification overlay and quit
      this.displayPasswordPrompt = true;
      return;
    } else if (this.profileSettingsComp.updateCheck.email) {
      this.displayPasswordPrompt = true;
    }
    const response = await this.userStore.updateUserAttributes(this.profileUpdateList);
    if (response.successful) {
      this.alert.success('Profile updates saved successfully!');
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

  async applyEmailChange(password: string) {
    if (!password) {
      this.alert.error('Password cannot be empty');
      this.showAlert();
      return;
    }
    const response = await this.userStore.updateEmail(this.profileUpdateList.email, password);
    if (response.successful) {
      this.alert.success('Email updated successfully!');
      this.profileSettingsComp.updateCheck.email = false;
      this.displayPasswordPrompt = false;
      this.password.patchValue('');
      if (Object.values(this.profileUpdateList).length === 1) {
        this.setChange(this.PROFILE_IDX, false);
      }
    } else {
      this.alert.error(response.message);
    }
    this.showAlert();
  }

  async applyPasswordChange() {
    const response = await this.authWrapper.changePassword(
      this.password.value,
      this.newPassword.value,
      this.confirmPassword.value
    );
    if (response.successful) {
      this.alert.success('Password changed successfully!');
      this.closePasswordChangeOverlay();
    } else {
      this.alert = response;
    }
    this.showAlert();
  }

  async handleForgotPassword(email: string) {
    const response = await this.authWrapper.forgotPassword(email);
    if (response.successful) {
      this.alert.success('An account recovery link was sent to the email associated with your account.\nClick on the link to setup a new password.');
      this.displayEmailPrompt = false;
    } else {
      this.alert = response;
    }
    this.showAlert();
  }

  showForgotPasswordOverlay() {
    this.displayPasswordPrompt = false;
    this.displayPasswordChangeOverlay = false;
    this.displayEmailPrompt = true;
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

  showPasswordChangeOverlay() {
    this.displayPasswordChangeOverlay = true;
  }

  closeAlert() {
    this.displayAlert = false;
  }

  closePasswordChangeOverlay() {
    this.displayPasswordChangeOverlay = false;
    this.password.reset();
    this.newPassword.reset();
    this.confirmPassword.reset();
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
      this.hideTooltip(this.visibleTooltip);
    }
  }

}
