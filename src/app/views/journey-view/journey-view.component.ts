import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Journey } from 'src/app/models/journey';
import { MatSidenav } from '@angular/material/sidenav';
import { UserStoreService } from 'src/app/models/user-store.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Application } from 'src/app/models/application';

@Component({
  selector: 'app-journey-view',
  templateUrl: './journey-view.component.html',
  styleUrls: ['./journey-view.component.css']
})
export class JourneyViewComponent implements OnInit {

  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;

  journey: Journey = new Journey();
  applications: Application[];
  startDate: string;
  endDate: string;
  iconClass: string;
  displayDrawer = true;
  drawerMode = 'add';
  selectedApp = null;

  constructor(private route: ActivatedRoute, private userStore: UserStoreService, private router: Router) { }

  ngOnInit() {
    console.log("view initialized");
    let id;
    this.route.params.subscribe(params => {
      id = params.id;
      return params.id;
    });
    this.journey = this.userStore.getJourney(id);
    if (!this.journey) {
      console.log('No journey loaded.');
      this.router.navigate(["/journeys"]);
      return;
    } else {
      console.log('loaded journey', this.journey);
    }
    this.setJourneyDetails();
  }

  setJourneyDetails() {
    this.applications = this.journey.applications;
    this.startDate = this.journey.startDate.toLocaleDateString();
    this.endDate = this.journey.endDate
      ? this.journey.endDate.toLocaleDateString()
      : 'Present';
    this.iconClass = this.journey.active
      ? 'active-icon'
      : 'inactive-icon';
  }

  viewApplication(application: Application) {
    this.displayDrawer = true;
    this.drawerMode = 'edit';
    this.selectedApp = application;
    console.log("selected", application);
  }

  addApplication() {
    this.displayDrawer = true;
    this.drawerMode = 'add';
  }

  openDrawer(mode: string, application: Application) {
    this.drawerMode = mode;
    this.selectedApp = application;
    this.sidenav.open();
  }

  closeDrawer() {
    if (this.displayDrawer) {
      this.displayDrawer = false;
      this.sidenav.close();
    }
  }

  onDataLogged(applicationData: { [key: string]: any }) {
    // console.log(journeyData);
    // this.userStore.addNewJourney(journeyData);
    // this.displayDrawer = false;
    console.log("i don't know");
  }
}
