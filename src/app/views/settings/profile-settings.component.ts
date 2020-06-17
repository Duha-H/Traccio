import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { STATE_ATTRIBS } from 'src/app/controllers/app-state-store.service';
import { TextFieldComponent } from 'src/app/components/text-field/text-field.component';
import { Response } from 'src/app/utils/response';
import { User } from 'src/app/models/user';
import { UserStoreService } from 'src/app/models/user-store.service';
import { DEFAULT_PROFILE_UPDATE_CHECK } from './constants';

@Component({
  selector: 'settings-profile',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {

  ATTRIBS = STATE_ATTRIBS;
  user: User;
  updateCheck = Object.assign({}, DEFAULT_PROFILE_UPDATE_CHECK); // easier lookup for updated attribs
  // changes = false;
  displayVerifyOverlay = false;
  verificationCode = '';
  changePassword = false;
  PASSWORD = {
    OLD: 'old',
    NEW: 'new',
    CONFIRM: 'confirm',
  };
  updateList: {[key: string]: string } = {};

  @Output() updates: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() showAlert: EventEmitter<Response> = new EventEmitter<Response>();

  constructor(private userStore: UserStoreService) { }

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

  }

  closeVerifyOverlay() {
    this.displayVerifyOverlay = false;
  }

  toggleChangePassword() {
    this.changePassword = !this.changePassword;
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
