import { Component, OnInit } from '@angular/core';
import { UserStoreService } from 'src/app/models/user-store.service';
import { data } from '../../models/data';
import { Journey } from '../../models/journey';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  name = '';
  data = data;
  yearSpacing = 40;
  dayBorderWidth = 2;
  journeys: Journey[];

  constructor(private userStore: UserStoreService) { }

  ngOnInit() {
    try {
      this.name = `${this.userStore.user.firstName}`;
      this.journeys = Object.values(this.userStore.journeys);
      // let res = await this.api.ListJourneys();
      // console.log(res);
      // console.log("anything");
      console.log("dashboard init");
    } catch (error) {
      console.log("User not defined yet"); // should probably make sure this never happens
      console.log(error);
    }
  }


}
