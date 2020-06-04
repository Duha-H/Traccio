import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { Journey } from "src/app/models/journey";
import { MatSidenav } from "@angular/material/sidenav";
import { UserStoreService } from "src/app/models/user-store.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Application } from "src/app/models/application";
import { MatTableDataSource, MatTable } from "@angular/material/table";
import { SelectionModel, DataSource } from "@angular/cdk/collections";
import { STATUS, APP_SOURCE } from "src/app/models/constants";
import { Observable, from, Subscription } from "rxjs";
import { MatSort } from "@angular/material/sort";
import { AppFilterPipe } from '../dashboard/app-filter.pipe';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatOptionSelectionChange } from '@angular/material/core';

const DRAWER_MODES = {
  ADD: "add",
  EDIT: "edit",
}; // don't want to take any chances

@Component({
  selector: "app-journey-view",
  templateUrl: "./journey-view.component.html",
  styleUrls: ["./journey-view.component.css"],
})
export class JourneyViewComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: MatSidenav;
  @ViewChild("table", { static: false }) table: MatTable<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filterElement", {static: false}) dropdownElement: MatSelect;

  journey: Journey = new Journey();
  applications: Application[];
  startDate: string;
  endDate: string;
  iconClass: string;
  displayDrawer = false;
  drawerMode = DRAWER_MODES.ADD;
  selectedApp;
  dataSource = new MatTableDataSource<Application>(this.applications);
  // dataSource: ApplicationDataSource;
  displayedColumns = [
    "select",
    "positionTitle",
    "companyName",
    "appDate",
    "source",
    "status",
    "remove",
  ];
  selection = new SelectionModel<Application>(true, []);
  deleteButtonPressed = false;
  filterDropdown = [
    {
      name: 'Status',
      items: [
        {value: STATUS.IN_REVIEW.toString(), viewValue: STATUS.IN_REVIEW.toString()},
        {value: STATUS.INTERVIEW.toString(), viewValue: STATUS.INTERVIEW.toString()},
        {value: STATUS.OFFER.toString(), viewValue: STATUS.OFFER.toString()},
        {value: STATUS.REJECTED.toString(), viewValue: STATUS.REJECTED.toString()},
        {value: STATUS.STALE.toString(), viewValue: STATUS.STALE.toString()}
      ]
    },
    {
      name: 'Source',
      items: [
        {value: APP_SOURCE.JOB_BOARD.toString(), viewValue: APP_SOURCE.JOB_BOARD.toString()},
        {value: APP_SOURCE.REFERRAL.toString(), viewValue: APP_SOURCE.REFERRAL.toString()},
        {value: APP_SOURCE.FAIR.toString(), viewValue: APP_SOURCE.FAIR.toString()},
        {value: APP_SOURCE.OTHER.toString(), viewValue: APP_SOURCE.OTHER.toString()},
      ]
    },
  ];
  filterValues: string[] = [];
  filterObjects = {
    status: '',
    source: '',
  };

  constructor(
    private route: ActivatedRoute,
    private userStore: UserStoreService,
    private router: Router,
    private filterPipe: AppFilterPipe,
  ) {}

  ngOnInit() {
    let id: string;
    let appref: string | number;
    // extract journey ID from URL, then get journey from UserStore
    this.route.params.subscribe((params) => {
      id = params.id;
      if (params.appref) {
        appref = params.appref;
      }
      return params.id;
    });
    this.journey = this.userStore.getJourney(id);
    // this.dataSource = new ApplicationDataSource(id, this.userStore);
    this.setJourneyDetails();
    if (!this.journey) {
      console.log("No journey loaded.");
      this.router.navigate(["/journeys"]);
      return;
    } else {
      this.selectedApp = this.userStore.getApplication(
        this.journey.id,
        +appref
      );
      if (appref && this.selectedApp) {
        this.displayDrawer = true;
      }
    }
  }

  updateView() {
    if (this.journey) {
      console.log("updating");
      this.journey = this.userStore.getJourney(this.journey.id); // probably no longer necessary
      this.applications = this.journey.applications;
      // according to docs this will "render the diff since the last table render.
      // If the data array reference is changed, the table will automatically trigger an update to the rows"
      // this.table.renderRows();
      this.dataSource.data = this.applications;
    }
  }

  setJourneyDetails() {
    this.applications = this.journey.applications;
    this.dataSource.data = this.applications;
    this.dataSource.sort = this.sort;
    this.startDate = this.journey.startDate.toLocaleDateString();
    this.endDate = this.journey.endDate
      ? this.journey.endDate.toLocaleDateString()
      : "Present";
    this.iconClass = this.journey.active ? "active-icon" : "inactive-icon";
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

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  checkboxLabel(app?: Application): string {
    if (!app) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${this.selection.isSelected(app) ? "deselect" : "select"} row ${
      app.positionTitle
    }`;
  }

  removeApplications(apps: Application[]) {
    this.deleteButtonPressed = true;
    apps.forEach((app) => {
      this.userStore.removeApplication(this.journey.id, app.id);
    });
    this.selection.deselect(...apps);
    // Update current journey details and view
    this.updateView();
  }

  applyFilter(event: MatOptionSelectionChange) {
    this.dropdownElement.close();
    const group = event.source.group.label.toLowerCase();
    const value = event.source.value;
    if (event.source.selected) { // item was selected
      this.filterObjects[group] += value;
      this.filterValues.push(value);
    } else { // item was deselected
      this.filterObjects[group] = this.filterObjects[group].replace(value, '');
      this.filterValues.filter(filterValue => filterValue !== value);
    }
    // Apply filter to applications using pipe
    this.dataSource.data = this.filterPipe.transform(this.applications, [
      {
        property: 'status',
        value: this.filterObjects.status
      },
      {
        property: 'source',
        value: this.filterObjects.source
      }
    ]);
  }
}

export class ApplicationDataSource extends DataSource<any> {
  data: Application[] = [];
  subscription: Subscription;

  constructor(private journeyid: string, private userStore: UserStoreService) {
    super();
  }

  connect(): Observable<Application[]> {
    let applications: Observable<Application[]> = from([]);
    // subscribe to changes propagated from userStore
    // update dataSource
    this.subscription = this.userStore.journeys.subscribe((_) => {
      const journey = this.userStore.getJourney(this.journeyid);
      applications = from([journey.applications]);
      this.data = journey.applications;
      console.log("Updated:", this.data);
      return applications;
    });
    return applications;
  }

  disconnect() {
    this.subscription.unsubscribe();
  }
}
