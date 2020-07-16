import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { STATE_ATTRIBS } from 'src/app/controllers/app-state-store.service';
import { TextFieldComponent } from 'src/app/components/text-field/text-field.component';
import { Response } from 'src/app/utils/response';
import { User } from 'src/app/models/user';
import { UserStoreService } from 'src/app/models/user-store.service';
import { DEFAULT_PROFILE_UPDATE_CHECK } from './constants';
import { ResizeService } from 'src/app/controllers/resize.service';

@Component({
  selector: 'settings-profile',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./settings.component.css'],
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    "(document:click)": "onViewClick($event)",
  },
})
export class ProfileSettingsComponent implements OnInit {

  ATTRIBS = STATE_ATTRIBS;
  user: User;
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
  visibleTooltip: ElementRef = undefined;

  @Output() updates: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() updatePassword: EventEmitter<object> = new EventEmitter<object>();
  @Output() showAlert: EventEmitter<Response> = new EventEmitter<Response>();

  constructor(private userStore: UserStoreService, public rs: ResizeService) { }

  ngOnInit() {
    this.userStore.user.subscribe(user => {
      this.user = user;
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
    if (this.visibleTooltip) {
      this.visibleTooltip.nativeElement.className = 'info'; // hide already-visible tooltip
    }
    this.visibleTooltip = new ElementRef(document.getElementById(id));
    this.visibleTooltip.nativeElement.style.top = `${event.y + 20}px`;
    this.visibleTooltip.nativeElement.style.left = `${event.x + 20}px`;
    this.visibleTooltip.nativeElement.className += ' visible';
    setTimeout(() => {
      this.hideTooltip();
    }, 8000);
    event.preventDefault();
  }

  hideTooltip() {
    if (this.visibleTooltip) {
      this.visibleTooltip.nativeElement.className = 'info';
      this.visibleTooltip = undefined;
    }
  }

  onViewClick(event: MouseEvent) {
    let tooltipVisible = false;
    if (this.visibleTooltip && !this.visibleTooltip.nativeElement.contains(event.target)) {
      console.log('hiding ittt');
      tooltipVisible = true;
      // this.hideTooltip();
    }
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
