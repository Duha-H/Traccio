import { Injectable } from '@angular/core';
import { APIService } from '../API.service';
import { resolve } from 'dns';
import { Journey } from '../models/journey';
import { Application } from '../models/application';

@Injectable({
  providedIn: 'root'
})
export class UserStoreControllerService {

  constructor(private api: APIService) { }

  async fetchUserJourneys(userid: string) {
    const journeys: {[key: string]: any} = {};
    // fetch user journeys
    await this.api.GetUserEntry(userid)
      .then(value => {
        const journeyList: {[key: string]: any}[] = value.journeys.items;
        // for each journey, fetch applications
        journeyList.forEach(async journey => {
          await this.fetchJourneyApps(journey.id)
            .then(fetchedApps => {
              const apps = fetchedApps.map((app) => {
                return new Application(app);
              });
              // assign extracted values to a new Journey object
              journeys[journey.id] = new Journey(journey);
              journeys[journey.id].applications = apps;
            });
        });
        return journeys;
      })
      .catch(error => {
        console.log("Error fetching user journeys: ", error);
      });
    return journeys;
  }

  async fetchJourneyApps(journeyid: string) {
    let apps: object[] = [];
    await this.api.GetJourney(journeyid)
      .then(value => {
        apps = value.applications.items;
      })
      .catch(error => {
        console.log(`Error fetching journey ${journeyid} apps:`, error);
        apps = [];
      });
    return apps;
  }
}
