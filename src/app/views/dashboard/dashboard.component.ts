import { Component, OnInit } from '@angular/core';
import { UserStoreService } from 'src/app/models/user-store.service';
import * as mockData from '../../models/data';
import { Journey } from '../../models/journey';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  name = '';
  data = mockData.data;
  yearSpacing = 40;
  dayBorderWidth = 2;
  activeJourneys: Journey[];
  selectedJourney: {value: Journey, viewValue: string, data: object};
  dropdownContent: {value: Journey, viewValue: string, data: object}[] = [];

  constructor(private userStore: UserStoreService) { }

  ngOnInit() {
    try {
      this.name = this.userStore.user.firstName;
      this.userStore.activeJourneys
        .subscribe(activeJourneys => {
          this.activeJourneys = activeJourneys;
          this.setDropdownContent();
        });
      this.selectedJourney = this.dropdownContent[0];
      console.log("dashboard init");
    } catch (error) {
      console.log("User not defined yet"); // should probably make sure this never happens
      console.log(error);
    }
  }

  setDropdownContent() {
    this.activeJourneys.forEach(journey => {
      this.dropdownContent.push({
        value: journey,
        viewValue: journey.title,
        data: this.userStore.getCalendarData(journey.id)
      });
    });
  }

}
