import { Component, OnInit, Injector, OnChanges } from '@angular/core';
import { UserStoreService } from '../../models/user-store.service';
import { API } from 'aws-amplify';
import { Journey } from 'src/app/models/journey';

@Component({
  selector: 'app-journeys',
  templateUrl: './journeys.component.html',
  styleUrls: ['./journeys.component.css']
})
export class JourneysComponent implements OnInit, OnChanges {

  displayDrawer = false;
  currTitle = '';
  currDate: number[] = [];
  currStatus = false;
  currJourney: Journey = null;

  constructor(public userStore: UserStoreService) { }

  ngOnInit() {
    // API
    //   .get("apicef3c0a9", "/journeys", {})
    //   .then(response => {
    //     // Add your code here
    //     console.log("something happened");
    //     console.log(response.data);
    //   })
    //   .catch(error => {
    //     console.log(error.response);
    // });
  }

  ngOnChanges() {
    console.log('new title?', this.currTitle);
  }

  displayJourneyDrawer() {
    this.displayDrawer = true;
  }

  onDataLogged(journeyData: { [key: string]: any }) {
    // console.log(journeyData);
    this.userStore.addNewJourney(journeyData);
    this.displayDrawer = false;
  }

}
