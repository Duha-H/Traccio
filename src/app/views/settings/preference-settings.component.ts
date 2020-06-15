import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { AppStateStoreService, StateStore, DEFAULT_STATE, STATE_ATTRIBS } from 'src/app/controllers/app-state-store.service';
import { TextFieldComponent } from 'src/app/components/text-field/text-field.component';
import { Response } from 'src/app/utils/response';
import { User } from 'src/app/models/user';
import { UserStoreService } from 'src/app/models/user-store.service';
import { DEFAULT_PREFERENCES_UPDATE_LIST } from './settings.component';

@Component({
  selector: 'settings-preferences',
  templateUrl: './preference-settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class PreferenceSettingsComponent implements OnInit {

  updateList: {[key: string]: string | number} = {};
  updateCheck = Object.assign({}, DEFAULT_PREFERENCES_UPDATE_LIST); // easier lookup for updated attribs

  ngOnInit() { }
}
