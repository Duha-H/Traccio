import { Component, OnInit } from '@angular/core';
import { UserStoreService } from 'src/app/models/user-store.service';
import { ResponsiveCalendar } from '@nivo/calendar';
import { data } from './data';
import * as React from 'react';


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


  constructor(private userStore: UserStoreService) { }

  ngOnInit() {
    try {
      this.name = `${this.userStore.user.firstName}`;
    } catch (error) {
      console.log("User not defined yet");
      console.log(error);
    }
  }

  private render() {

  }

}
