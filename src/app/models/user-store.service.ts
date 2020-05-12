import { Injectable } from '@angular/core';
import { User } from './user';
import { Journey } from './journey';
import * as mApps from './mock-applications';
import { Application } from './application';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {

  user: User;
  testJourney1 = new Journey({
    title: 'Test1',
    startDate: [13, 4, 2019],
    active: true,
    id: 0,
    apps: mApps.MOCK_APPS_2,
  });
  testJourney2 = new Journey({
    title: 'Test2221',
    startDate: [15, 9, 2017],
    endDate: [20, 1, 2019],
    active: false,
    id: 1,
    apps: mApps.MOCK_APPS_1,
  });
  journeys: {[key: number]: Journey} = {
    0: this.testJourney1,
    1: this.testJourney2,
  };
  dataUpdated = false;

  constructor() { }

  setUser(
    firstName: string,
    lastName: string,
    id: string
  ) {
    this.user = new User();
    this.user.firstName = firstName;
    this.user.lastName = lastName;
    this.user.userid = id;
  }

  getUserEntryInput() {
    // use only when a user is first initialized
    const input = this.user.getGraphQLInput();
    const journeys = Object.values(this.journeys);
    if (journeys.length !== 0) {
      input['journeys'] = journeys.map(journey => journey.getGraphQLInput());
      console.log(input.journeys);
    }
    console.log(input);
    return input;
  }

  fetchData() {
    // called on app init
    // performs API calls to fetch user data
    console.log(this.user);
    console.log("fetching data");
  }

  updateData() {
    this.dataUpdated = true;
  }

  clearData() {
    this.user = undefined;
    this.journeys = [this.testJourney1, this.testJourney2]; // TODO: temporary, remove later
  }

  getJourney(id: number): Journey {
    // tslint:disable-next-line: radix
    // return this.journeys.find(element => element.id === id);
    return this.journeys[id];
  }

  getApplication(journeyId: number, appId: number): Application {
    // tslint:disable-next-line: radix
    return this.getJourney(journeyId).applications.find(element => element.id === appId);
  }

  addNewJourney(journeyData: { [key: string]: any }) {
    const journeyID = this._getNewJourneyID();
    journeyData.id = journeyID;
    const newJourney = new Journey(journeyData);
    // update current state
    // this.journeys.push(newJourney);
    this.journeys[journeyID] = newJourney;
    this.dataUpdated = true;
    console.log("journey added:", newJourney);
  }

  addNewApplication(journeyId: number, appData: { [key: string]: any }) {
    const journey = this.getJourney(journeyId);
    const appID = this._getNewAppID(journeyId);
    appData.id = appID;
    const newApplication = new Application(appData);
    journey.applications.push(newApplication); // wooowiiieee
    this.dataUpdated = true;
    console.log("application added: ", newApplication);
  }

  updateExistingJourney(udpatedJourney: Journey) {
    const journeyID = udpatedJourney.id;
    let existingJourney = this.getJourney(journeyID);
    existingJourney = udpatedJourney;
    console.log("journey updated:", existingJourney);
    console.log(this.journeys);
  }

  updateExistingApplication(journeyId: number, updatedApplication: Application) {
    // const updatedApplication = new Application(appData);
    const appID = updatedApplication.id;
    let existingApplication = this.getApplication(journeyId, appID);
    existingApplication = updatedApplication;
    console.log("application updated: ", existingApplication);
    console.log(this.journeys);
  }

  private _getNewJourneyID(): number {
    let maxID = 0;
    Object.keys(this.journeys).forEach((id) => {
      if (parseInt(id) >= maxID) { maxID = parseInt(id) + 1; }
    });
    return maxID;
  }

  private _getNewAppID(journeyId: number): number {
    const apps = this.getJourney(journeyId).applications;
    let maxID = apps.length;
    apps.forEach((element) => {
      if (element.id >= maxID) { maxID = element.id + 1; }
    });
    return maxID;
  }
}
