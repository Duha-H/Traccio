import { Injectable } from '@angular/core';
import { UserStoreService } from 'src/app/models/user-store.service';
import { User } from 'src/app/models/user';
import { UserStoreControllerService } from './user-store-controller.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Response } from 'src/app/utils/response';

@Injectable({
  providedIn: 'root'
})
export class AppStateStoreService {

  private _state: BehaviorSubject<StateStore> = new BehaviorSubject<StateStore>(DEFAULT_STATE);
  public readonly state: Observable<StateStore> = this._state.asObservable();

  user: User;

  constructor(private userStore: UserStoreService, private controller: UserStoreControllerService) {
    // let currUser: User;
    this.userStore.user.subscribe(user => {
      console.log("User updated:", user);
      this.user = user;
    });
    let currTheme = 'dark';
    let currPalette = 0;
    if (this.user.isDefined()) {
      // this.controller.fetchUserJourneys(this.user.userid)
      //   .then((result: { theme: string, colorPalette: number }) => {
      //     currTheme = result.theme;
      //     currPalette = result.colorPalette;
      //   })
      //   .catch(error => {
      //     currTheme = 'dark';
      //     currPalette = 0;
      //   });
    }
    this._state.next({
      given_name: this.user.firstName,
      family_name: this.user.lastName,
      email: this.user.email,
      email_verified: this.user.verified,
      theme: currTheme,
      colorPalette: currPalette
    });
  }

  updateAttributes(updates: {[key: string]: string | number}) {
    const response = new Response();
    const profileUpdates: {[key: string]: string} = {};
    const currState = this._state.getValue();
    let updatedUser = {
      given_name: currState.given_name,
      family_name: currState.family_name,
      email: currState.email,
      email_verified: currState.email_verified,
    };
    let updatedTheme = currState.theme;
    let updatedPalette = currState.colorPalette;

    for (const attrib of Object.keys(updates)) {
      const value = updates[attrib];
      switch (attrib) {
        case STATE_ATTRIBS.EMAIL:
        case STATE_ATTRIBS.FIRST_NAME:
        case STATE_ATTRIBS.LAST_NAME:
        case STATE_ATTRIBS.PASSWORD:
          profileUpdates[attrib] = value as string;
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
    }
    if (Object.keys(profileUpdates).length !== 0) {
      // updatedUser = this._updateProfile(profileUpdates);

    }

    // this._state.next({
    //   given_name: updatedUser.given_name,
    //   family_name: updatedUser.family_name,
    //   email: updatedUser.email,
    //   email_verified: updatedUser.email_verified,
    //   theme: updatedTheme,
    //   colorPalette: updatedPalette,
    // });

    return response;
  }

  verifyEmail(code: string): string {
    this.userStore.verifyUser(code)
      .then(result => {
        const currUser = this.userStore.user;
        this._state.next({
          given_name: this.user.firstName,
          family_name: this.user.lastName,
          email: this.user.email,
          email_verified: this.user.verified,
          theme: this._state.getValue().theme,
          colorPalette: this._state.getValue().colorPalette,
        });
        return result;
      })
      .catch(error => {
        return error;
      });
    return '';
  }

  private _updateProfile(updates: {[key: string]: string}): {
    given_name: string,
    family_name: string,
    email: string,
    email_verified: boolean,
  } {
    console.log("UPDATES:", updates);
    this.userStore.updateUserAttributes(updates);
    return {
      given_name: this.user.firstName,
      family_name: this.user.lastName,
      email: this.user.email,
      email_verified: this.user.verified,
    };
  }

}

export interface StateStore {
  given_name: string;
  family_name: string;
  email: string;
  email_verified: boolean;
  theme: 'dark' | 'light' | string;
  colorPalette: 0 | 1 | 2 | 3 | number;
}

export const DEFAULT_STATE: StateStore = {
  given_name: '',
  family_name: '',
  email: '',
  email_verified: true,
  theme: 'dark',
  colorPalette: 0
};

export const PALETTES = {
  0: ['#9f9dea', '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560'],
  1: ['#9f9dea', '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560'],
  2: ['#9f9dea', '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560'],
  3: ['#9f9dea', '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560'],
};

export const STATE_ATTRIBS = { // attribute names match an AuthUser object's attribute names
  FIRST_NAME: 'given_name',
  LAST_NAME: 'family_name',
  EMAIL: 'email',
  VERIFIED: 'email_verified',
  PASSWORD: 'password',
  THEME: 'theme',
  PALETTE: 'colorPalette'
};
