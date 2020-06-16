import { Injectable } from '@angular/core';
import { APIService } from '../API.service';
import { Journey } from '../models/journey';
import { Application, ApplicationInput } from '../models/application';

@Injectable({
  providedIn: 'root'
})
export class UserStoreControllerService {

  constructor(private api: APIService) { }

  async fetchTheme(userid: string): Promise<{
    theme: string,
    colorPalette: number
  }> {
    const theme = 'dark';
    const colorPalette = 0;
    // retrieve theme details from user entry in DB
    return {
      theme,
      colorPalette
    };
  }

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
              const apps = fetchedApps.map((app: ApplicationInput) => {
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
    let apps: ApplicationInput[] = [];
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
