import { Injectable } from '@angular/core';
import { APIService } from 'src/app/traccio-api.service';
import { Journey } from 'src/app/models/journey';
import { Application } from 'src/app/models/application';
import { ApplicationInput, UserInput } from 'src/app/models/types';
import { Response } from '../utils/response';
import { LoaderService } from './loader.service';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';


const USER_COLLECTION = 'users';
const JOURNEY_COLLECTION = 'user-journeys';

@Injectable({
  providedIn: 'root'
})
export class UserStoreControllerService {

  constructor(
    private api: APIService,
    private loaderService: LoaderService,
    private firestore: AngularFirestore,
  ) { }

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
    this.loaderService.setLoadingState(true);
    await this.firestore.collection(USER_COLLECTION).doc(userid).get().toPromise()
      .then(result => {
        const data = result.data();
        theme = data.theme;
        colorPalette = data.palette;
        journeyInactive = data.journeyInactive;
        appStale = data.appStale;
      }).catch(error => {
        console.log('Error retrieving preference data:', error);
      });
    this.loaderService.setLoadingState(false);
    return {
      theme,
      colorPalette,
      journeyInactive,
      appStale
    };
  }

  async updateTheme(userid: string, updatedTheme: string) {
    const response = new Response();
    await this.firestore.collection(USER_COLLECTION).doc(userid).update({
      theme: updatedTheme,
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
    await this.firestore.collection(USER_COLLECTION).doc(userid).update({
      palette: updatedPalette,
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
    await this.firestore.collection(USER_COLLECTION).doc(userid).update({
      journeyInactive: newValue,
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
    await this.firestore.collection(USER_COLLECTION).doc(userid).update({
      appStale: newValue,
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
    this.loaderService.setLoadingState(true);
    await this.firestore.collection(USER_COLLECTION).doc(userid).get().toPromise()
      .then(value => {
        const data = value.data();
        if (data.journeys.length === 0) {
          response.payload = [];
          return response;
        }
        // retrieve info for each user journey from JOURNEYS_COLLECTION
        data.journeys.forEach(ref => {
          this.firestore.doc(ref).get().toPromise()
            .then(journeyInfo => {
              const input = journeyInfo.data();
              if (input) {
                const newJourney = new Journey({
                  id: journeyInfo.id,
                  title: input.title,
                  startDate: input.startDate,
                  endDate: input.endDate,
                  active: input.active,
                  applications: [],
                });
                const apps = [];
                Object.keys(input.applications).forEach(appid => {
                  apps.push(new Application(input.applications[appid]));
                });
                newJourney.applications = apps;
                journeys[journeyInfo.id] = newJourney;
              }
            });
        });
        console.log(journeys);
        response.payload = journeys;
      }).catch(error => {
        console.log('Error fetching journeys:', error);
        response.error('Looks like an error occured while trying to fetch your journeys');
        response.payload = error;
      });
    this.loaderService.setLoadingState(false);

    return response;
  }

  async fetchJourneyApps(journeyid: string) {
    let apps: Application[] = [];
    this.loaderService.setLoadingState(true);
    await this.firestore.collection(JOURNEY_COLLECTION).doc(journeyid).get().toPromise()
      .then(journeyInfo => {
        const applicationsObj = journeyInfo.data().applications;
        for (const appid of Object.keys(applicationsObj)) {
          apps.push(new Application(applicationsObj[appid]));
        }
      }).catch(error => {
        console.log(`Error fetching journey ${journeyid} apps:`, error);
        apps = [];
      });
    this.loaderService.setLoadingState(false);

    return apps;
  }

  async fetchWishlistApps(userid: string): Promise<Response> {
    const response = new Response();
    response.payload = [];
    this.loaderService.setLoadingState(true);
    await this.firestore.collection(USER_COLLECTION).doc(userid).get().toPromise()
      .then(value => {
        const data = value.data();
        if (data.wishlist && Object.keys(data.wishlist).length !== 0) {
          response.payload = Object.values(data.wishlist);
        }
      }).catch(error => {
        console.log('Error fetching wishlist apps:', error);
        response.error('Looks like an error occured while trying to fetch your wishlist applications');
      });
    this.loaderService.setLoadingState(false);

    return response;
  }

  async addNewJourney(data: Journey, userid: string): Promise<Response> {
    const response = new Response();
    await this.firestore.collection(JOURNEY_COLLECTION).doc(data.id).set(
      data.getGQLInput()
    ).then(async () => {
      console.log(this.firestore.collection(JOURNEY_COLLECTION).doc(data.id).ref);
      const journeyRef = this.firestore.collection(JOURNEY_COLLECTION).doc(data.id).ref;
      await this.firestore.collection(USER_COLLECTION).doc(userid).update({
        journeys: firebase.firestore.FieldValue.arrayUnion(journeyRef)
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
    await this.firestore.collection(JOURNEY_COLLECTION).doc(updatedJourney.id).update(
      updatedJourney.getGQLInput()
    ).then(value => {
      response.payload = value; // value is void so this is meaningless??
    }).catch(error => {
      console.log('Error updating journey:', error); // TODO: figure out better error logging behaviour
      response.error('An error occured while trying to update Journey details, please try again');
      response.payload = error;
    });
    return response;
  }

  async removeJourney(journey: Journey, userid: string): Promise<Response> {
    const response = new Response();
    const journeyRef = this.firestore.collection(JOURNEY_COLLECTION).doc(journey.id).ref;
    // remove journey doc ref from user
    await this.firestore.collection(USER_COLLECTION).doc(userid).update({
      journeys: firebase.firestore.FieldValue.arrayRemove(journeyRef)
    }).catch(error => {
      console.log('Error removing journey:', error); // TODO: figure out better error logging behaviour
      response.error('An error occured while trying to remove your Journey, please try again');
      response.payload = error;
      return response;
    });
    // remove journey
    await this.firestore.collection(JOURNEY_COLLECTION).doc(journey.id).delete()
      .catch(error => {
        console.log('Error removing journey:', error); // TODO: figure out better error logging behaviour
        response.error('An error occured while trying to remove your Journey, please try again');
        response.payload = error;
      });
    return response;
  }

  async addNewApplication(application: Application, journeyid: string): Promise<Response> {
    const response = new Response();
    await this.firestore.collection(JOURNEY_COLLECTION).doc(journeyid).update({
      [`applications.${application.id}`]: application.getGQLInput()
    }).then(() => {
      response.payload = application;
    }).catch(error => {
      console.log('Error adding application:', error); // TODO: figure out better error logging behaviour
      response.error('An error occured while trying to add your application, please try again');
      response.payload = error;
    });
    return response;
  }

  async updateApplication(updatedApplication: Application, journeyid: string): Promise<Response> {
    const response = new Response();
    await this.firestore.collection(JOURNEY_COLLECTION).doc(journeyid).update({
      [`applications.${updatedApplication.id}`]: updatedApplication.getGQLInput()
    }).then(() => {
      response.payload = updatedApplication;
    }).catch(error => {
      console.log('Error updating application:', error); // TODO: figure out better error logging behaviour
      response.error('An error occured while trying to update application details, please try again');
      response.payload = error;
    });
    return response;
  }

  async removeApplication(appid: string, journeyid: string): Promise<Response> {
    const response = new Response();
    await this.firestore.collection(JOURNEY_COLLECTION).doc(journeyid).update({
      [`applications.${appid}`]: firebase.firestore.FieldValue.delete()
    }).catch(error => {
      console.log('Error removing application:', error);
      response.error('An error occured while trying to remove an application, please try again');
      response.payload = error;
    });
    return response;
  }

  async addNewWishlistApplication(application: Application, userid: string): Promise<Response> {
    const response = new Response();
    await this.firestore.collection(USER_COLLECTION).doc(userid).update({
      [`wishlist.${application.id}`]: application.getGQLInput(true)
    }).catch(error => {
      console.log('Error adding wishlist application:', error); // TODO: figure out better error logging behaviour
      response.error('An error occured while trying to add your application, please try again');
      response.payload = error;
    });
    return response;
  }

  async updateWishlistApplication(updatedApplication: Application, userid: string): Promise<Response> {
    const response = new Response();
    await this.firestore.collection(USER_COLLECTION).doc(userid).update({
      [`wishlist.${updatedApplication.id}`]: updatedApplication.getGQLInput(true)
    }).catch(error => {
      console.log('Error updating wishlist application:', error); // TODO: figure out better error logging behaviour
      response.error('An error occured while trying to update your application, please try again');
      response.payload = error;
    });
    return response;
  }

  async removeWishlistApplication(appid: string, userid: string): Promise<Response> {
    const response = new Response();
    await this.firestore.collection(USER_COLLECTION).doc(userid).update({
      [`wishlist.${appid}`]: firebase.firestore.FieldValue.delete()
    }).catch(error => {
      console.log('Error removing wishlist application:', error);
      response.error('An error occured while trying to remove a wishlist application, please try again');
      response.payload = error;
    });
    return response;
  }
}
