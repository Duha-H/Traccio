import { Injectable } from "@angular/core";
import { User } from "./user";
import { Journey } from "./journey";
import * as mock from "./mock-journeys";
import * as mockApps from "./mock-applications";
import { Application, ApplicationInput } from "./application";
import { UserStoreControllerService } from "../controllers/user-store-controller.service";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { map } from "rxjs/operators";
import { DataManagerService } from "../controllers/data-manager.service";
import { Auth } from 'aws-amplify';

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
  private _journeys: BehaviorSubject<{
    [key: string]: Journey;
  }> = new BehaviorSubject<{ [key: string]: Journey }>(
    this.placeholderJourneys
  );
  public readonly journeys: Observable<Journey[]> = this._journeys.pipe(
    map((entry) => Object.values(entry).reverse())
  );

  private _activeJourneys: BehaviorSubject<Journey[]> = new BehaviorSubject<
    Journey[]
  >(this.getActiveJourneys());
  public readonly activeJourneys: Observable<
    Journey[]
  > = this._activeJourneys.asObservable();

  private _wishlistApps: BehaviorSubject<Application[]> = new BehaviorSubject<Application[]>(mockApps.MOCK_APPS_1);
  public readonly wishlistApps: Observable<Application[]> = this._wishlistApps.asObservable();

  private _user: BehaviorSubject<User> = new BehaviorSubject<User>(new User());
  public readonly user: Observable<User> = this._user.asObservable();

  constructor(
    private controller: UserStoreControllerService,
    private dataManager: DataManagerService
  ) {}

  /**
   * Initial Setup Methods
   */

  async setUser(firstName: string, lastName: string, id: string, email: string, verified: boolean) {
    const newUser = new User();
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.userid = id;
    newUser.email = email;
    newUser.verified = verified;
    this._user.next(newUser);
    console.log(verified);
    await this.fetchData();
  }

  async updateUserAttributes(updates: {
    [key: string]: string
  }) {
    let currUser = await Auth.currentAuthenticatedUser();
    try {
      const result = await Auth.updateUserAttributes(currUser, updates);
      currUser = await Auth.currentAuthenticatedUser();
      const updatedUser = this._user.getValue();
      updatedUser.firstName = currUser.attributes.given_name;
      updatedUser.lastName = currUser.attributes.family_name;
      updatedUser.email = currUser.attributes.email;
      if (updates['email']) { // if the user's email has been updated
        updatedUser.verified = false; // expect verification flow
      }
      this._user.next(updatedUser);
    } catch (error) {
      console.error("Error updating user attributes:", error);
    }
  }

  async verifyUser(code: string) {
    try {
      const result = await Auth.verifyCurrentUserAttributeSubmit('email', code);
      const updatedUser = this._user.getValue();
      updatedUser.verified = true;
      this._user.next(updatedUser);
      console.log(result);
      return result;
    } catch (error) {
      console.error("Error confirming code:", error);
      return error;
    }
  }

  async fetchData() {
    // Called on app init
    // Performs API calls to fetch user data
    let data = {};
    // await this.controller.fetchUserJourneys(this.user.userid).then((value) => {
    //   // this._journeys.next(value);
    //   data = value;
    // });
    data = this.placeholderJourneys; // TEMP
    this.updateJourneyData(data);
    this.dataManager.collectData(data);
  }

  /**
   * Observable Update Trigger Methods
   */

  loadData() {
    // Fires .next() on _journeys and _activeJourneys observable to update ("refresh") data
    this._journeys.next(this._journeys.getValue());
    this._activeJourneys.next(this.getActiveJourneys());
  }

  updateJourneyData(newJourneys?: { [key: string]: Journey }) {
    // this.dataUpdated = true;
    if (newJourneys) {
      this._journeys.next(newJourneys);
      this._activeJourneys.next(this.getActiveJourneys());
    } else {
      this._journeys.next(this._journeys.getValue());
      this._activeJourneys.next(this.getActiveJourneys());
    }
  }

  clearData() {
    this._user.next(new User());
    this.updateJourneyData(this.placeholderJourneys);
  }

  /**
   * Data Retrieval Methods
   */

  getJourney(id: string): Journey {
    return this._journeys.getValue()[id];
  }

  getApplication(journeyId: string, appId: number): Application {
    // tslint:disable-next-line: radix
    return this.getJourney(journeyId).applications.find(
      (element) => element.id === appId
    );
  }

  getActiveJourneys() {
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

  /**
   * User Data Updating Methods
   */

  addNewJourney(journeyData: { [key: string]: any }) {
    journeyData.id = journeyData.id // if ID is undefined, generate a new ID
      ? journeyData.id
      : this._getNewJourneyID();
    const newJourney = new Journey(journeyData);
    // update current data
    const updatedJourneys = this._journeys.getValue();
    updatedJourneys[journeyData.id] = newJourney;
    this.dataManager.addJourney(newJourney);
    this.updateJourneyData(updatedJourneys);
    this.dataUpdated = true;
    console.log("journey added:", this.journeys);
    // make necessary api calls
  }

  removeJourney(journeyid: string) {
    const updatedJourneys = this._journeys.getValue();
    delete updatedJourneys[journeyid];
    this.dataManager.removeJourney(journeyid);
    this.updateJourneyData(updatedJourneys);
    this.dataUpdated = true;
  }

  addNewApplication(journeyId: string, appData: ApplicationInput) {
    const journey = this.getJourney(journeyId);
    const appID = this._getNewAppID(journeyId);
    appData.id = appID;
    const newApplication = new Application(appData);
    this.dataManager.addApplication(journeyId, newApplication);
    journey.applications.push(newApplication); // wooowiiieee
    // TODO: should this maybe trigger a data reload??
    this.dataUpdated = true;
    console.log("application added: ", newApplication);
    this.updateJourneyData(); // data update, bubble .next() it to all observables
  }

  updateExistingApplication(
    journeyid: string,
    updatedApplication: Application
  ) {
    const appID = updatedApplication.id;
    const journey = this.getJourney(journeyid);
    const existingApplication = this.getApplication(journeyid, appID);
    this.dataManager.updateExistingApplication(
      journeyid,
      existingApplication,
      updatedApplication
    );
    const updatedApps = journey.applications.map((app) => {
      return app.id === updatedApplication.id ? updatedApplication : app;
    });
    // existingApplication = updatedApplication;
    journey.applications = updatedApps;
    this.updateJourneyData(); // data updated, bubble .next() it to all observables
  }

  removeApplication(journeyid: string, appid: number) {
    const journey = this.getJourney(journeyid);
    const remainingApps = journey.applications.filter((app) => {
      return app.id !== appid;
    });
    this.dataManager.removeApplication(
      journeyid,
      this.getApplication(journeyid, appid)
    );
    journey.applications = remainingApps;
    this.updateJourneyData(); // data updated, bubble .next() it to all observables
  }

  /**
   * Auxiliary Methods
   */

  private _getNewJourneyID(): string {
    let maxID = 0;
    Object.keys(this._journeys.getValue()).forEach((id) => {
      // Note:
      // IDs are in the format "cbsd2-nkbjkd-dn4jbks-01"
      // where the last two digits represent the unique numerical ID of the journey
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

  private _getNewAppID(journeyId: string): number {
    const apps = this.getJourney(journeyId).applications;
    let maxID = apps.length;
    apps.forEach((element) => {
      if (element.id >= maxID) {
        maxID = element.id + 1;
      }
    });
    return maxID;
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
