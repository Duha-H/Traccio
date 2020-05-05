import { Injectable } from '@angular/core';
import { User } from './user';
import { Journey } from './journey';
import * as mApps from './mock-applications';

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
  journeys: Journey[] = [this.testJourney1, this.testJourney2];
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
    this.journeys = [];
  }

  getJourney(id: number): Journey {
    // tslint:disable-next-line: radix
    return this.journeys.find(element => element.id === id);
  }

  addNewJourney(journeyData: { [key: string]: any }) {
    console.log("journeys:", this.journeys);
    const journeyID = this.journeys.length;
    journeyData.id = journeyID;
    const newJourney = new Journey(journeyData);
    console.log(newJourney);
    // update current state
    this.journeys.push(newJourney);
    this.dataUpdated = true;
  }
}
