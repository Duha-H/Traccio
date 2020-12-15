import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { TextFieldComponent } from 'src/app/shared-components/text-field/text-field.component';
import { Response } from 'src/app/utils/response';
import { User } from 'src/app/models/user';
import { UserStoreService } from 'src/app/models/user-store.service';
import { DEFAULT_PROFILE_UPDATE_CHECK } from './constants';
import { ResizeService } from 'src/app/controllers/resize.service';
import { FormControl, Validators } from '@angular/forms';
import { containsLowercaseValidator, containsNumberValidator, containsUppercaseValidator } from 'src/app/utils/validators';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'settings-profile',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {

  ATTRIBS = { // attribute names match a User object's attribute names
    FIRST_NAME: 'firstName',
    LAST_NAME: 'lastName',
    EMAIL: 'email',
    VERIFIED: 'verified',
    PASSWORD: 'password',
    THEME: 'theme',
    PALETTE: 'colorPalette',
  };
  user: User = new User();
  updateCheck = Object.assign({}, DEFAULT_PROFILE_UPDATE_CHECK); // easier lookup for updated attribs
  displayVerifyOverlay = false;
  verificationCode = '';
  updateList: {[key: string]: string } = {};
  email = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  @Output() updates: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() updatePassword: EventEmitter<object> = new EventEmitter<object>();
  @Output() showAlert: EventEmitter<Response> = new EventEmitter<Response>();
  @Output() showTooltip: EventEmitter<object> = new EventEmitter<object>();
  @Output() hideTooltip: EventEmitter<ElementRef> = new EventEmitter<ElementRef>();

  constructor(public userStore: UserStoreService, public rs: ResizeService) { }

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

  closeVerifyOverlay() {
    this.displayVerifyOverlay = false;
  }

  toggleChangePassword() {
    this.updatePassword.emit();
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
