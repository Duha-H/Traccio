import { Injectable } from "@angular/core";
import { User } from "./user";
import { Journey } from "./journey";
import * as mock from "./mock-journeys";
import { Application } from "./application";
import { UserStoreControllerService } from "../controllers/user-store-controller.service";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class UserStoreService {

  user: User;
  initialJourneys: { [key: string]: Journey } = {
    0: mock.testJourney1,
    1: mock.testJourney2
  };
  dataUpdated = false;

  private _journeys: BehaviorSubject<{
    [key: string]: Journey;
  }> = new BehaviorSubject<{ [key: string]: Journey }>(this.initialJourneys);
  // Not exposing _journeys observer to prevent clients
  // of UserStoreService from directly updating values
  // public readonly journeys: Observable<{[key: string]: Journey}> = this._journeys.asObservable();
  public readonly journeys: Observable<Journey[]> = this._journeys.pipe(
    map((entry) => Object.values(entry).reverse())
  );

  constructor(private controller: UserStoreControllerService) { }

  async setUser(firstName: string, lastName: string, id: string) {
    this.user = new User();
    this.user.firstName = firstName;
    this.user.lastName = lastName;
    this.user.userid = id;
    // await this.fetchData();
  }

  getUserEntryInput() {
    // use only when a user is first initialized
    const input = this.user.getGraphQLInput();
    const journeys = Object.values(this.journeys);
    if (journeys.length !== 0) {
      input.journeys = journeys.map((journey) => journey.getGraphQLInput());
      console.log(input.journeys);
    }
    console.log(input);
    return input;
  }

  async fetchData() {
    // Called on app init
    // Performs API calls to fetch user data
    console.log("HERE:::data about to be fetched");
    let data = {};
    await this.controller.fetchUserJourneys(this.user.userid).then((value) => {
      // this._journeys.next(value);
      data = value;
    });
    console.log("HERE:::data fetched", data);
    this._journeys.next(data);
  }

  loadData() {
    // Fires .next() on _journeys observable to update ("refresh") data
    this._journeys.next(this._journeys.getValue());
  }

  updateData() {
    this.dataUpdated = true;
  }

  clearData() {
    this.user = undefined;
    this._journeys.next(this.initialJourneys);
  }

  getJourney(id: string): Journey {
    return this._journeys.getValue()[id];
  }

  getApplication(journeyId: string, appId: number): Application {
    // tslint:disable-next-line: radix
    return this.getJourney(journeyId).applications.find(
      (element) => element.id === appId
    );
  }

  addNewJourney(journeyData: { [key: string]: any }) {
    journeyData.id = journeyData.id // if ID is undefined, generate a new ID
      ? journeyData.id
      : this._getNewJourneyID();
    const newJourney = new Journey(journeyData);
    // update current data
    const updatedJourneys = this._journeys.getValue();
    updatedJourneys[journeyData.id] = newJourney;
    this._journeys.next(updatedJourneys);
    this.dataUpdated = true;
    console.log("journey added:", this.journeys);
    // make necessary api calls
  }

  addNewApplication(journeyId: string, appData: { [key: string]: any }) {
    const journey = this.getJourney(journeyId);
    const appID = this._getNewAppID(journeyId);
    appData.id = appID;
    const newApplication = new Application(appData);
    journey.applications.push(newApplication); // wooowiiieee
    this.dataUpdated = true;
    console.log("application added: ", newApplication);
  }

  updateExistingApplication(
    journeyId: string,
    updatedApplication: Application
  ) {
    const appID = updatedApplication.id;
    let existingApplication = this.getApplication(journeyId, appID);
    existingApplication = updatedApplication;
    console.log("application updated: ", existingApplication);
    console.log(this.journeys);
  }

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
    const newID = `${this.user.userid}-${maxID}`;
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
}
