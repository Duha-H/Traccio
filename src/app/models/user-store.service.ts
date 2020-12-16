import { Injectable, ElementRef } from "@angular/core";
import { User } from "./user";
import { Journey } from "./journey";
import * as mock from "./mock-journeys";
import * as mockApps from "./mock-applications";
import { Application } from "./application";
import { ApplicationInput, UserInput } from "src/app/models/types";
import { UserStoreControllerService } from "src/app/controllers/user-store-controller.service";
import { DataManagerService } from "src/app/controllers/data-manager.service";
import { AuthWrapperService } from 'src/app/auth/auth-wrapper.service';
import { FormattedFrequencyData } from 'src/app/controllers/types';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { LoaderService } from '../controllers/loader.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class UserStoreService {
  // user: User;
  placeholderJourneys: { [key: string]: Journey } = {
    0: mock.testJourney1,
    1: mock.testJourney2,
    2: mock.testJourney3,
    3: mock.testJourney4,
  };
  dataUpdated = false;

  // Not exposing _journeys observer to prevent clients
  // of UserStoreService from directly updating values
  // public readonly journeys: Observable<{[key: string]: Journey}> = this._journeys.asObservable();
  public _journeys: BehaviorSubject<{
    [key: string]: Journey;
  }> = new BehaviorSubject<{ [key: string]: Journey }>({});
  public readonly journeys: Observable<Journey[]> = this._journeys.pipe(
    map(entry => Object.values(entry))
  );

  private _activeJourneys: BehaviorSubject<Journey[]> = new BehaviorSubject<
    Journey[]
  >(this.getActiveJourneys());
  public readonly activeJourneys: Observable<
    Journey[]
  > = this._activeJourneys.asObservable();

  private _wishlistApps: BehaviorSubject<Application[]> = new BehaviorSubject<Application[]>([]);
  public readonly wishlistApps: Observable<Application[]> = this._wishlistApps.asObservable();

  private _user: BehaviorSubject<User> = new BehaviorSubject<User>(new User());
  public readonly user: Observable<User> = this._user.asObservable();

  constructor(
    private controller: UserStoreControllerService,
    private dataManager: DataManagerService,
    private authWrapper: AuthWrapperService,
    private firestore: AngularFirestore,
    private loaderService: LoaderService,
  ) { }

  /**
   * Initial Setup Methods
   */

  async setUser(id: string, verified: boolean, identityProvider?: 'DEFAULT' | 'GOOGLE') {
    const newUser = new User();
    newUser.userid = id;
    await this.firestore.collection('users').doc<UserInput>(id).get().toPromise()
      .then(result => {
        const data = result.data();
        newUser.firstName = data.firstName;
        newUser.lastName = data.lastName;
        newUser.email = data.email;
        newUser.verified = verified;
        newUser.identityProvider = identityProvider ? identityProvider : 'DEFAULT';
        this._user.next(newUser);
      }).catch(error => {
        console.log('Error fetching user data:', error);
      });
    await this.fetchData();
  }

  async updateUserAttributes(updates: {
    [key: string]: string
  }) {
    // On success, updated CognitoUser is returned in the response's payload
    // On failure, an error code is returned in the response's payload
    const response = await this.controller.updateUserAttributes(this._user.value.userid, updates);
    if (response.successful) {
      const updatedUser = Object.assign(this._user.getValue(), updates);
      // TODO: handle case where email is updated
      this._user.next(updatedUser);
    } else {
      console.log('UserStore: attributes not updated:', response.payload);
    }

    return response;
  }

  async updateEmail(newEmail: string, password: string) {
    let response = await this.authWrapper.changeEmail(newEmail, password);
    if (response.successful) {
      response = await this.controller.updateUserAttributes(this._user.value.userid, { email: newEmail });
      if (response.successful) {
        const updatedUser = Object.assign(this._user.getValue(), { email: newEmail });
        this._user.next(updatedUser);
      } else {
        console.log('UserStore: email not updated:', response.payload);
      }
    } else {
      console.log('UserStore: email not updated:', response.payload);
    }

    return response;
  }

  async changeUserPassword(oldPassword: string, newPassword: string, confirmPassword: string) {
    return await this.authWrapper.changePassword(oldPassword, newPassword, confirmPassword);
  }

  async fetchData() {
    /**
     * TODO: Potentially look into turning it into a PWA, or somehow
     * figure out a way to collect data offline
     * ALSO catch an offline client error
     */
    this.loaderService.setLoadingState(true);
    await this.fetchUserJourneys();
    await this.fetchWishlistApps();
    this.loaderService.setLoadingState(false);
  }

  async fetchUserJourneys() {
    await this.controller.fetchUserJourneys(this._user.getValue().userid)
      .then(response => {
        if (response.successful) {
          this._journeys.next(response.payload);
          const activeJourneyList = Object.values(this._journeys.getValue()).filter(journey => journey.active);
          this._activeJourneys.next(activeJourneyList);
          const activeJourneyMap: {[key: string]: Journey} = {};
          Object.values(this._journeys.getValue()).map((journey: Journey) => activeJourneyMap[journey.id] = journey);
          this.dataManager.collectData(activeJourneyMap);
        } else {
          return response;
        }
      });
  }

  async fetchWishlistApps() {
    await this.controller.fetchWishlistApps(this._user.getValue().userid)
      .then(response => {
        if (response.successful) {
          this._wishlistApps.next(response.payload);
        } else {
          return response;
        }
      });
  }

  /**
   * Observable Update Trigger Methods
   */

  updateJourneyData(newJourneys?: { [key: string]: Journey }) {
    // Fires .next() on _journeys and _activeJourneys observable to update ("refresh") data
    if (newJourneys) {
      this._journeys.next(newJourneys);
    } else {
      this._journeys.next(this._journeys.getValue());
    }
    this._activeJourneys.next(this.getActiveJourneys());
  }

  clearData() {
    this._user.next(new User());
    this.updateJourneyData({});
  }

  /**
   * Data Retrieval Methods
   */

  getJourney(id: string): Journey {
    return this._journeys.getValue()[id];
  }

  getApplication(journeyId: string, appId: string): Application {
    // tslint:disable-next-line: radix
    return this.getJourney(journeyId).applications.find(
      (element) => element.id === appId
    );
  }

  getWishlistApplication(appId: string): Application {
    return this._wishlistApps.getValue().find(
      (element) => element.id === appId
    );
  }

  getJourneys(): Journey[] {
    return Object.values(this._journeys.getValue());
  }

  getActiveJourneys(): Journey[] {
    let activeJourneys = Object.values(this._journeys.getValue()).filter(
      (journey) => journey.active
    );
    activeJourneys = activeJourneys.sort((a: Journey, b: Journey) => {
      // sort journeys by latest start date
      return a.startDate > b.endDate ? 1 : -1;
    });
    return activeJourneys;
  }

  getCalendarData(journeyid: string): { day: string; value: number }[] {
    return this.dataManager.getFormattedCalendarData(journeyid);
  }

  getStatusData(
    journeyid: string
  ): {
    id: string;
    label: string;
    value: number;
    color: string;
  }[] {
    return this.dataManager.getFormattedStatusData(journeyid);
  }

  getFrequencyData(journeyid: string): FormattedFrequencyData {
    return this.dataManager.getFormattedFrequencyData(journeyid);
  }

  /**
   * User Data Updating Methods
   */

  async addNewJourney(journeyData: { [key: string]: any }) {
    journeyData.id = journeyData.id // if ID is undefined, generate a new ID
      ? journeyData.id
      : this._getNewJourneyID();
    journeyData.userId = this._user.getValue().userid;
    const newJourney = new Journey(journeyData);
    // make necessary api calls
    const response = await this.controller.addNewJourney(newJourney, this._user.getValue().userid);
    if (!response.successful) {
      return response;
    }
    // update current "cached" data
    const updatedJourneys = this._journeys.getValue();
    updatedJourneys[journeyData.id] = newJourney;
    this.dataManager.addJourney(newJourney);
    this.updateJourneyData(updatedJourneys);
    this.dataUpdated = true;

    return response;
  }

  async updateExistingJourney(updatedJourney: Journey) {
    const response = await this.controller.updateJourney(updatedJourney);
    if (!response.successful) {
      return response;
    }
    const updatedJourneys = this._journeys.getValue();
    updatedJourneys[updatedJourney.id] = updatedJourney;
    this.updateJourneyData(updatedJourneys);

    return response;
  }

  async removeJourney(journeyid: string, itemRef?: ElementRef) {
    const response = await this.controller.removeJourney(this.getJourney(journeyid), this._user.value.userid);
    if (!response.successful) {
      return response;
    }
    if (itemRef) {
      // this is stupid, but update UI before losing reference :)
      itemRef.nativeElement.classList.add('remove');
    }
    setTimeout(() => {
      if (itemRef) {
        itemRef.nativeElement.classList.remove('remove');
      }
      const updatedJourneys = this._journeys.getValue();
      delete updatedJourneys[journeyid];
      this.dataManager.removeJourney(journeyid);
      this.updateJourneyData(updatedJourneys);
      this.dataUpdated = true;
    }, 500);

    return response;
  }

  async addNewApplication(journeyId: string, appData: ApplicationInput | Application) {
    const journey = this.getJourney(journeyId);
    if (!journey) {
      console.log('UserStore: journey with id', journeyId, 'does not exist.');
      return;
    }
    let newApplication: Application;
    if (appData instanceof Application) {
      newApplication = Object.assign(new Application(), appData);
    } else {
      newApplication = new Application(appData);
    }
    const appID = this._getNewAppID(journeyId);
    newApplication.id = appID;
    const response = await this.controller.addNewApplication(newApplication, journeyId);
    if (!response.successful) {
      return response;
    }
    response.payload = newApplication;
    journey.applications.push(newApplication); // wooowiiieee
    this.dataManager.addApplication(journeyId, newApplication);
    // TODO: should this maybe trigger a data reload??
    this.dataUpdated = true;
    this.updateJourneyData(); // data update, bubble .next() it to all observables

    return response;
  }

  async updateExistingApplication(
    journeyid: string,
    updatedApplication: Application
  ) {
    const appID = updatedApplication.id;
    const journey = this.getJourney(journeyid);
    const existingApplication = this.getApplication(journeyid, appID);
    const response = await this.controller.updateApplication(updatedApplication, journeyid);
    if (!response.successful) {
      return response;
    }
    this.dataManager.updateExistingApplication(
      journeyid,
      existingApplication,
      updatedApplication
    );
    const updatedApps = journey.applications.map(app => {
      return app.id === updatedApplication.id ? updatedApplication : app;
    });
    // existingApplication = updatedApplication;
    journey.applications = updatedApps;
    this.updateJourneyData(); // data updated, bubble .next() it to all observables

    return response;
  }

  async removeApplication(journeyid: string, appid: string) {
    const journey = this.getJourney(journeyid);
    const response = await this.controller.removeApplication(appid, journeyid);
    if (!response.successful) {
      return response;
    }
    const remainingApps = journey.applications.filter(app => {
      return app.id !== appid;
    });
    this.dataManager.removeApplication(
      journeyid,
      this.getApplication(journeyid, appid)
    );
    journey.applications = remainingApps;
    this.updateJourneyData(); // data updated, bubble .next() it to all observables

    return response;
  }

  async addNewWishlistApplication(appData: Application | ApplicationInput) {
    let newApplication: Application;
    if (appData instanceof Application) {
      newApplication = appData;
    } else {
      newApplication = new Application(appData);
    }
    const appID = this._getNewAppID();
    newApplication.id = appID;
    const response = await this.controller.addNewWishlistApplication(newApplication, this._user.value.userid);
    if (!response.successful) {
      return response;
    }
    response.payload = newApplication;
    const updatedWishlist = this._wishlistApps.getValue();
    updatedWishlist.push(newApplication);
    this._wishlistApps.next(updatedWishlist);

    return response;
  }

  async updateWishlistApplication(updatedApplication: Application) {
    const response = await this.controller.updateWishlistApplication(updatedApplication, this._user.value.userid);
    if (!response.successful) {
      return response;
    }
    const updatedWishlist = this._wishlistApps.getValue().map(app => {
      return app.id === updatedApplication.id ? updatedApplication : app;
    });
    this._wishlistApps.next(updatedWishlist);

    return response;
  }

  async removeWishlistApplication(appid: string) {
    const response = await this.controller.removeWishlistApplication(appid, this._user.value.userid);
    if (!response.successful) {
      return response;
    }
    const updatedWishlistApps = this._wishlistApps.getValue().filter(app => app.id !== appid);
    this._wishlistApps.next(updatedWishlistApps);

    return response;
  }

  /**
   * Auxiliary Methods
   */

  private _getNewJourneyID(): string {
    let maxID = 0;
    Object.keys(this._journeys.getValue()).forEach(id => {
      // Note:
      // IDs are in the format "cbsd2-nkbjkd-dn4jbks-1"
      // where the last digit represent the unique numerical ID of the journey
      // and the initial string of characters is the owning-user's ID
      // so we're extracting the digits and incrementing to generate a new ID
      // while maintaining the user ID
      const currval = +id.split("-").pop(); // TODO: TEST THIS
      if (currval >= maxID) {
        maxID = currval + 1;
      }
    });
    const newID = `${this._user.getValue().userid}-${maxID}`;
    return newID;
  }

  private _getNewAppID(journeyId?: string): string {
    const apps = journeyId ? this.getJourney(journeyId).applications : this._wishlistApps.getValue();
    let maxID = 0;
    apps.forEach(app => {
      const currval = +app.id.split("-").pop(); // TODO: TEST THIS
      if (currval >= maxID) {
        maxID = currval + 1;
      }
    });
    const newID = journeyId ? `${journeyId}-${maxID}` : `${this._user.getValue().userid}-${maxID}`;
    return newID;
  }

  private _getUserEntryInput() {
    // use only when a user is first initialized
    const input = this._user.getValue().getGraphQLInput();
    const journeys = Object.values(this.journeys);
    if (journeys.length !== 0) {
      input.journeys = journeys.map((journey) => journey.getGraphQLInput());
    }
    return input;
  }
}
