import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { STATE_ATTRIBS } from 'src/app/controllers/app-state-store.service';
import { TextFieldComponent } from 'src/app/shared-components/text-field/text-field.component';
import { Response } from 'src/app/utils/response';
import { User } from 'src/app/models/user';
import { UserStoreService } from 'src/app/models/user-store.service';
import { DEFAULT_PROFILE_UPDATE_CHECK } from './constants';
import { ResizeService } from 'src/app/controllers/resize.service';

@Component({
  selector: 'settings-profile',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {

  ATTRIBS = STATE_ATTRIBS;
  user: User = new User();
  updateCheck = Object.assign({}, DEFAULT_PROFILE_UPDATE_CHECK); // easier lookup for updated attribs
  displayVerifyOverlay = false;
  verificationCode = '';
  changePassword = false;
  passwordDetails = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  updateList: {[key: string]: string } = {};
  // visibleTooltip: ElementRef = undefined;
  // clickedTooltipIcon: EventTarget = undefined;

  @Output() updates: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() updatePassword: EventEmitter<object> = new EventEmitter<object>();
  @Output() showAlert: EventEmitter<Response> = new EventEmitter<Response>();
  @Output() showTooltip: EventEmitter<object> = new EventEmitter<object>();
  @Output() hideTooltip: EventEmitter<ElementRef> = new EventEmitter<ElementRef>();

  constructor(public userStore: UserStoreService, public rs: ResizeService) { }

  ngOnInit() {
    this.userStore.user.subscribe(user => {
      this.user = user;
      console.log(user);
    });
  }

  addUpdate(updateAttrib: string, updateValue: string) {
    this.updates.emit(true);
    this.updateList[updateAttrib] = updateValue;
    this.updateCheck[updateAttrib] = true;
  }

  undoChange(updateAttrib: string, field: TextFieldComponent) {
    field.resetValue();
    delete this.updateList[updateAttrib];
    this.updateCheck[updateAttrib] = false;
    if (Object.keys(this.updateList).length === 0) {
      this.updates.emit(false);
    }
  }

  addPasswordChange(category: string, value: string) {
    this.passwordDetails[category] = value;
  }

  applyPasswordChange() {
    this.updatePassword.emit(this.passwordDetails);
  }

  resetPasswordChange() {
    this.changePassword = false;
    this.passwordDetails = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  }

  closeVerifyOverlay() {
    this.displayVerifyOverlay = false;
  }

  toggleChangePassword() {
    this.changePassword = !this.changePassword;
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

  async verifyEmail(code: string) {
    const response = await this.userStore.verifyUser(code);
    if (response.successful) {
      this.displayVerifyOverlay = false;
    } else {
      console.log(response);
    }
    // bubble result upwards to SettingsComponent
    this.showAlert.emit(response);
  }
}
