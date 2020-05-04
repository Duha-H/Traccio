import { Injectable } from '@angular/core';
import { User } from './user';
import { Journey } from './journey';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {

  user: User;
  journeys: Journey[] = [];
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
    this.user = null;
    this.journeys = null;
  }

  addNewJourney(journeyData: { [key: string]: any }) {
    const journeyID = this.journeys.length;
    journeyData.id = journeyID;
    const newJourney = new Journey(journeyData);
    console.log(newJourney);
    // update current state
    this.journeys.unshift(newJourney);
    this.dataUpdated = true;
  }
}
