import { Component, OnInit, OnChanges } from '@angular/core';
import { UserStoreService } from '../../models/user-store.service';
import { Journey } from 'src/app/models/journey';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-journey-list',
  templateUrl: './journey-list.component.html',
  styleUrls: ['./journey-list.component.css']
})
export class JourneyListComponent implements OnInit, OnChanges {

  displayDrawer = false;
  currTitle = '';
  currDate: number[] = [];
  currStatus = false;
  currJourney: Journey = null;
  // id = 0;
  journeys: Journey[];
  editButton = false;
  date = new Date();

  constructor(public userStore: UserStoreService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    console.log("initializing list");
    this.journeys = Object.values(this.userStore.journeys);
    console.log("journeys:", this.journeys);
  }

  ngOnChanges() {
    console.log("back to list");
    this.journeys = Object.values(this.userStore.journeys);
  }

  displayJourneyDrawer() {
    this.displayDrawer = true;
  }

  onEditButtonPressed(selectedJourney: Journey) {
    this.displayDrawer = true;
    this.editButton = true;
    this.currJourney = selectedJourney;
    // this.currTitle = selectedJourney.title;
    // this.currStatus = selectedJourney.active;
    // this.date.setDate(selectedJourney.startDate[0]);
    // this.date.setMonth(selectedJourney.startDate[1]);
    // this.date.setFullYear(selectedJourney.startDate[2]);
  }

  onNewDataLogged(journeyData: { [key: string]: any }) {
    // console.log(journeyData);
    // this.userStore.addNewJourney(journeyData);
    this.displayDrawer = false;
    this.journeys = Object.values(this.userStore.journeys);
  }

  onUpdateDataLogged(updatedJourney: Journey) {
    // this.userStore.updateExistingJourney(updatedJourney);
    // this.journeys = this.userStore.journeys;
    this.displayDrawer = false;
    console.log(this.journeys);
    this.journeys = Object.values(this.userStore.journeys);
  }

  loadJourney(id: number) {
    if (!this.editButton) {
      this.router.navigate(['/journeys', id]);
    } else {
      console.log('edit button was pressed');
      this.editButton = false;
      this.userStore.updateExistingJourney(this.currJourney);
    }
  }

}
