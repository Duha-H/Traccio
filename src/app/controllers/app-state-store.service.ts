import { Injectable } from '@angular/core';
import { UserStoreService } from '../models/user-store.service';
import { User } from '../models/user';
import { UserStoreControllerService } from './user-store-controller.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStateStoreService {

  private _state: BehaviorSubject<StateStore> = new BehaviorSubject<StateStore>(DEFAULT_STATE);
  public readonly state: Observable<StateStore> = this._state.asObservable();

  constructor(private userStore: UserStoreService, private controller: UserStoreControllerService) {
    const currUser = this.userStore.user;
    let currTheme = 'dark';
    let currPalette = 0;
    if (currUser.isDefined()) {
      this.controller.fetchUserJourneys(currUser.userid)
      .then((result: { theme: string, paletteID: number }) => {
        currTheme = result.theme;
        currPalette = result.paletteID;
      })
      .catch(error => {
        currTheme = 'dark';
        currPalette = 0;
      });
    }
    this._state.next({
      given_name: currUser.firstName,
      family_name: currUser.lastName,
      email: currUser.email,
      theme: currTheme,
      paletteID: currPalette
    });
  }

  updateAttributes(updates: {[key: string]: string | number}) {
    const profileUpdates = [];
    const currState = this._state.getValue();
    let updatedUser = {
      given_name: currState.given_name,
      family_name: currState.family_name,
      email: currState.email
    };
    let updatedTheme = currState.theme;
    let updatedPalette = currState.paletteID;

    for (const attrib of Object.keys(updates)) {
      const value = updates[attrib];
      switch (attrib) {
        case STATE_ATTRIBS.EMAIL:
        case STATE_ATTRIBS.FIRST_NAME:
        case STATE_ATTRIBS.LAST_NAME:
        case STATE_ATTRIBS.PASSWORD:
          profileUpdates.push({
            attrib,
            value: updates[attrib],
          });
          break;
        case STATE_ATTRIBS.THEME:
          updatedTheme = value as string;
          break;
        case STATE_ATTRIBS.PALETTE:
          updatedPalette = value as number;
          break;
        default:
          break;
      }
    };
    if (profileUpdates.length !== 0) {
      updatedUser = this._updateProfile(profileUpdates);
    }

    this._state.next({
      given_name: updatedUser.given_name,
      family_name: updatedUser.family_name,
      email: updatedUser.email,
      theme: updatedTheme,
      paletteID: updatedPalette,
    });
  }

  private _updateProfile(updates: {
    attrib: string,
    value: string,
  }[]): {
    given_name: string,
    family_name: string,
    email: string,
  } {
    console.log("UPDATES:", updates);
    return {
      given_name: this._state.getValue().given_name,
      family_name: this._state.getValue().family_name,
      email: this._state.getValue().email,
    };
  }

}

export interface StateStore {
  given_name: string;
  family_name: string;
  email: string;
  theme: 'dark' | 'light' | string;
  paletteID: 0 | 1 | 2 | 3 | number;
}

export const DEFAULT_STATE: StateStore = {
  given_name: '',
  family_name: '',
  email: '',
  theme: 'dark',
  paletteID: 0
};

export const PALETTES = {
  0: ['#9f9dea', '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560'],
  1: ['#9f9dea', '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560'],
  2: ['#9f9dea', '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560'],
  3: ['#9f9dea', '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560'],
};

export const STATE_ATTRIBS = {
  FIRST_NAME: 'given_name',
  LAST_NAME: 'family_name',
  EMAIL: 'email',
  PASSWORD: 'password',
  THEME: 'theme',
  PALETTE: 'paletteID'
};
