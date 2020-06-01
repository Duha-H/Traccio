import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Journey } from 'src/app/models/journey';
import { MatSidenav } from '@angular/material/sidenav';
import { UserStoreService } from 'src/app/models/user-store.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Application } from 'src/app/models/application';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

const DRAWER_MODES = {
  ADD: 'add',
  EDIT: 'edit',
}; // don't want to take any chances

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
  displayDrawer = false;
  drawerMode = DRAWER_MODES.ADD;
  selectedApp;
  dataSource = new MatTableDataSource<Application>();
  displayedColumns = ['select', 'positionTitle', 'companyName', 'appDate', 'source', 'status', 'remove'];
  selection = new SelectionModel<Application>(true, []);
  deleteButtonPressed = false;

  constructor(private route: ActivatedRoute, private userStore: UserStoreService, private router: Router) { }

  ngOnInit() {
    let id;
    let appref;
    // extract journey ID from URL, then get journey from UserStore
    this.route.params.subscribe(params => {
      id = params.id;
      if (params.appref) {
        appref = params.appref;
      }
      return params.id;
    });
    this.journey = this.userStore.getJourney(id);
    this.setJourneyDetails();
    if (!this.journey) {
      console.log('No journey loaded.');
      this.router.navigate(["/journeys"]);
      return;
    } else {
      this.selectedApp = this.userStore.getApplication(this.journey.id, +appref);
      if (appref && this.selectedApp) {
        this.displayDrawer = true;
      }
    }
  }

  setJourneyDetails() {
    this.applications = this.journey.applications;
    this.dataSource = new MatTableDataSource<Application>(this.applications);
    this.startDate = this.journey.startDate.toLocaleDateString();
    this.endDate = this.journey.endDate
      ? this.journey.endDate.toLocaleDateString()
      : 'Present';
    this.iconClass = this.journey.active
      ? 'active-icon'
      : 'inactive-icon';
  }

  addApplication() {
    this.displayDrawer = true;
    this.drawerMode = DRAWER_MODES.ADD;
  }

  openDrawer(mode: string, application: Application) {
    if (this.deleteButtonPressed) {
      this.deleteButtonPressed = false;
      return;
    }
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(app?: Application): string {
    if (!app) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(app) ? 'deselect' : 'select'} row ${app.positionTitle}`;
  }

  removeApplications(apps: Application[]) {
    this.deleteButtonPressed = true;
    apps.forEach(app => {
      this.userStore.removeApplication(this.journey.id, app.id);
    });
    // Update current journey details
    // TODO: maybe handle this using an observable
    this.journey = this.userStore.getJourney(this.journey.id);
    this.setJourneyDetails();
  }

}
