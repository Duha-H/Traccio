import { Injectable } from '@angular/core';
import { User } from './user';
import { Journey } from './journey';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {

  user: User;
  journeys: Journey[];

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

  clearData() {
    this.user = null;
    this.journeys = null;
  }
}
