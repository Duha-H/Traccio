import { Injectable } from '@angular/core';
import { APIService } from 'src/app/API.service';
import { Journey } from 'src/app/models/journey';
import { Application } from 'src/app/models/application';
import { ApplicationInput } from 'src/app/models/types';
import { Response } from '../utils/response';

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
    const result = await this.api.ListJourneys({
      id: {contains: userid}
    });
    const journeys: {[key: string]: Journey} = {};
    result.items.forEach(item => {
      const newJourney = new Journey({
        id: item.id,
        title: item.title,
        startDate: item.startDate,
        endDate: item.endDate,
        active: item.active,
        applications: [],
      });
      item.applications.items.forEach(app => {
        const newApp = new Application(app);
        newJourney.applications.push(newApp);
      });
      journeys[newJourney.id] = newJourney;
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

  async addNewJourney(data: Journey, userid: string): Promise<Response> {
    const response = new Response();
    await this.api.CreateJourney(data.getGQLInput())
      .then(async value => {
        // update userid
        response.payload = await this.api.UpdateJourney({
          id: value.id,
          journeyUseridId: userid
        });
      })
      .catch(error => {
        console.log('Error creating and updating journey:', error); // TODO: figure out better error logging behaviour
        response.error('An error occured while trying to add your Journey, please try again');
      });
    return response;
  }

  async updateJourney(updatedJourney: Journey) {
    const response = new Response();
    await this.api.UpdateJourney(updatedJourney.getGQLInput())
      .then(value => {
        response.payload = value;
      })
      .catch(error => {
        console.log('Error updating journey:', error); // TODO: figure out better error logging behaviour
        response.error('An error occured while trying to update Journey details, please try again');
      });
    return response;
  }

  async removeJourney(journey: Journey) {
    const response = new Response();
    await this.api.DeleteJourney({
      id: journey.id
      }).then(value => {
        response.payload = value;
      })
      .catch(error => {
        console.log('Error removing journey:', error); // TODO: figure out better error logging behaviour
        response.error('An error occured while trying to remove your Journey, please try again');
      });
    return response;
  }
}
