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

  async fetchPrefData(userid: string): Promise<{
    theme: string,
    colorPalette: string,
    journeyInactive: number,
    appStale: number
  }> {
    let theme = 'dark';
    let colorPalette = 'palette-0';
    let journeyInactive = 90;
    let appStale = 60;
    // retrieve theme details from user entry in DB
    await this.api.GetPrefData(userid)
      .then(value => {
        theme = value.theme;
        colorPalette = value.palette;
        journeyInactive = value.journeyInactive;
        appStale = value.appStale;
      }).catch(error => {
        console.log('Error retrieving theme data:', error);
      });
    return {
      theme,
      colorPalette,
      journeyInactive,
      appStale
    };
  }

  async updateTheme(userid: string, updatedTheme: string) {
    const response = new Response();
    await this.api.UpdateUserEntry({
      id: userid,
      theme: updatedTheme
    }).then(value => {
      response.payload = value;
    }).catch(error => {
      console.log('Error updating theme:', error);
      response.error('An error occured while updating your theme preference, please try again');
    });
    return response;
  }

  async updatePalette(userid: string, updatedPalette: string) {
    const response = new Response();
    await this.api.UpdateUserEntry({
      id: userid,
      palette: updatedPalette
    }).then(value => {
      response.payload = value;
    }).catch(error => {
      console.log('Error updating palette:', error);
      response.error('An error occured while updating your color palette preference, please try again');
    });
    return response;
  }

  async updateJourneyInactive(userid: string, newValue: number) {
    const response = new Response();
    await this.api.UpdateUserEntry({
      id: userid,
      journeyInactive: newValue
    }).then(value => {
      response.payload = value;
    }).catch(error => {
      console.log('Error updating journeyInactivity:', error);
      response.error('An error occured while updating journey inactivity preference, please try again');
    });
    return response;
  }

  async updateAppStale(userid: string, newValue: number) {
    const response = new Response();
    await this.api.UpdateUserEntry({
      id: userid,
      appStale: newValue
    }).then(value => {
      response.payload = value;
    }).catch(error => {
      console.log('Error updating appStale:', error);
      response.error('An error occured while updating stale application preference, please try again');
    });
    return response;
  }

  async fetchUserJourneys(userid: string) {
    const journeys: {[key: string]: Journey} = {};
    const response = new Response();
    await this.api.ListJourneys({
      id: {contains: userid}
    }).then(result => {
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
      response.payload = journeys;
    }).catch(error => {
      console.log('Error fetching journeys:', error);
      response.error('Looks like an error occured while trying to fetch your journeys');
      response.payload = error;
    });

    return response;
  }

  async fetchJourneyApps(journeyid: string) {
    let apps: ApplicationInput[] = [];
    await this.api.GetJourney(journeyid)
      .then(value => {
        apps = value.applications.items;
      }).catch(error => {
        console.log(`Error fetching journey ${journeyid} apps:`, error);
        apps = [];
      });

    return apps;
  }

  async fetchWishlistApps(userid: string): Promise<Response> {
    const response = new Response();
    await this.api.ListWishlistApplications({
      id: { contains: userid }
    }).then(value => {
      response.payload = value.items.map(data => new Application(data));
    }).catch(error => {
      console.log('Error fetching wishlist apps:', error);
      response.error('Looks like an error occured while trying to fetch your wishlist applications');
      response.payload = [];
    });
    return response;
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
      }).catch(error => {
        console.log('Error creating and updating journey:', error); // TODO: figure out better error logging behaviour
        response.error('An error occured while trying to add your Journey, please try again');
        response.payload = error;
      });
    return response;
  }

  async updateJourney(updatedJourney: Journey): Promise<Response> {
    const response = new Response();
    await this.api.UpdateJourney(updatedJourney.getGQLInput())
      .then(value => {
        response.payload = value;
      }).catch(error => {
        console.log('Error updating journey:', error); // TODO: figure out better error logging behaviour
        response.error('An error occured while trying to update Journey details, please try again');
        response.payload = error;
      });
    return response;
  }

  async removeJourney(journey: Journey): Promise<Response> {
    const response = new Response();
    // remove all journey applications
    journey.applications.forEach(app => {
      this.removeApplication(app.id).then(value => {
        if (!value.successful) {
          console.log('Error removing application:', value); // TODO: figure out better error logging behaviour
        }
      });
    });
    // remove journey
    await this.api.DeleteJourney({
      id: journey.id
    }).then(value => {
      response.payload = value;
    }).catch(error => {
      console.log('Error removing journey:', error); // TODO: figure out better error logging behaviour
      response.error('An error occured while trying to remove your Journey, please try again');
    });
    return response;
  }

  async addNewApplication(application: Application, journeyid: string): Promise<Response> {
    const response = new Response();
    await this.api.CreateApplication({
      ...application.getGQLInput(),
      applicationJourneyidId: journeyid
    }).then(value => {
        response.payload = value;
    }).catch(error => {
      console.log('Error adding application:', error); // TODO: figure out better error logging behaviour
      response.error('An error occured while trying to add your application, please try again');
      response.payload = error;
    });
    return response;
  }

  async updateApplication(updatedApplication: Application): Promise<Response> {
    const response = new Response();
    await this.api.UpdateApplication(updatedApplication.getGQLInput())
      .then(value => {
        response.payload = value;
      }).catch(error => {
        console.log('Error updating application:', error); // TODO: figure out better error logging behaviour
        response.error('An error occured while trying to update application details, please try again');
        response.payload = error;
      });
    return response;
  }

  async removeApplication(appid: string): Promise<Response> {
    const response = new Response();
    await this.api.DeleteApplication({
      id: appid
    }).then(value => {
      response.payload = value;
    }).catch(error => {
      console.log('Error removing application:', error);
      response.error('An error occured while trying to remove an application, please try again');
      response.payload = error;
    });
    return response;
  }

  async addNewWishlistApplication(application: Application): Promise<Response> {
    const response = new Response();
    await this.api.CreateWishlistApplication(application.getGQLInput(true))
      .then(value => {
        response.payload = value;
      }).catch(error => {
        console.log('Error adding wishlist application:', error); // TODO: figure out better error logging behaviour
        response.error('An error occured while trying to add your application, please try again');
        response.payload = error;
      });
    return response;
  }

  async updateWishlistApplication(updatedApplication: Application): Promise<Response> {
    const response = new Response();
    await this.api.UpdateWishlistApplication(updatedApplication.getGQLInput(true))
      .then(value => {
        response.payload = value;
      }).catch(error => {
        console.log('Error updating wishlist application:', error); // TODO: figure out better error logging behaviour
        response.error('An error occured while trying to update wishlist application details, please try again');
        response.payload = error;
      });
    return response;
  }

  async removeWishlistApplication(appid: string): Promise<Response> {
    const response = new Response();
    await this.api.DeleteWishlistApplication({
      id: appid
    }).then(value => {
      response.payload = value;
    }).catch(error => {
      console.log('Error removing wishlist application:', error);
      response.error('An error occured while trying to remove a wishlist application, please try again');
      response.payload = error;
    });
    return response;
  }
}
