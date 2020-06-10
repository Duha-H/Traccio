import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
  ElementRef,
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
import { AppFilterPipe } from "../dashboard/app-filter.pipe";
import { MatSelect, MatSelectChange } from "@angular/material/select";
import { MatOptionSelectionChange, MatOption } from "@angular/material/core";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

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
  @ViewChild("editButton") editButton: ElementRef;
  @ViewChild("sidenav", { static: false }) sidenav: MatSidenav;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filterElement", { static: false }) dropdownElement: MatSelect;
  @ViewChildren(MatOption) matOptions!: QueryList<MatOption>;

  viewMode: "edit" | "view" = "view";
  journey: Journey = new Journey();
  applications: Application[];
  startDate: string;
  endDate: string;
  iconClass: string;
  displayDrawer = false;
  drawerMode = DRAWER_MODES.ADD;
  today = new Date();
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
      name: "Status",
      items: [
        {
          value: STATUS.IN_REVIEW.toString(),
          viewValue: STATUS.IN_REVIEW.toString(),
        },
        {
          value: STATUS.INTERVIEW.toString(),
          viewValue: STATUS.INTERVIEW.toString(),
        },
        { value: STATUS.OFFER.toString(), viewValue: STATUS.OFFER.toString() },
        {
          value: STATUS.REJECTED.toString(),
          viewValue: STATUS.REJECTED.toString(),
        },
        { value: STATUS.STALE.toString(), viewValue: STATUS.STALE.toString() },
      ],
    },
    {
      name: "Source",
      items: [
        {
          value: APP_SOURCE.JOB_BOARD.toString(),
          viewValue: APP_SOURCE.JOB_BOARD.toString(),
        },
        {
          value: APP_SOURCE.REFERRAL.toString(),
          viewValue: APP_SOURCE.REFERRAL.toString(),
        },
        {
          value: APP_SOURCE.FAIR.toString(),
          viewValue: APP_SOURCE.FAIR.toString(),
        },
        {
          value: APP_SOURCE.OTHER.toString(),
          viewValue: APP_SOURCE.OTHER.toString(),
        },
      ],
    },
  ];
  filterObjects = {
    status: [],
    source: [],
  };

  constructor(
    private route: ActivatedRoute,
    private userStore: UserStoreService,
    private router: Router,
    private filterPipe: AppFilterPipe
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

  toggleViewMode() {
    this.viewMode = this.viewMode === "view" ? "edit" : "view";
    if (this.viewMode === "edit") {
      this.editButton.nativeElement.className = "active";
    } else {
      this.editButton.nativeElement.className = "";
    }
  }

  isToday(date: Date) {
    if (
      date.getDate() === this.today.getDate() &&
      date.getMonth() === this.today.getMonth() &&
      date.getFullYear() === this.today.getFullYear()
    ) {
      return true;
    } else {
      return false;
    }
  }

  updateEndDate(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      this.journey.active = false;
    }
    this.userStore.loadData();
  }

  toggleJourneyActive() {
    if (this.journey.active) {
      this.journey.active = false;
      this.journey.endDate = this.today;
    } else {
      this.journey.active = true;
      this.journey.endDate = undefined;
    }
    this.userStore.loadData();
  }

  updateView() {
    if (this.journey) {
      this.journey = this.userStore.getJourney(this.journey.id); // probably no longer necessary
      this.applications = this.journey.applications;
      this.dataSource.data = this.filterObjects.source.length !== 0 || this.filterObjects.status.length !== 0
        ? this._getFilteredData() // if any filters are selected, apply those
        : this.applications;
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

  addFilter(event: MatOptionSelectionChange) {
    this.dropdownElement.close();
    const group = event.source.group.label.toLowerCase();
    const value = event.source.value;
    // apply added filters
    this._applyFilter(group, value, event.source.selected);
  }

  removeFilter(property: string, value: string) {
    // de-select option
    const matOption = this.matOptions.filter(
      (option) => option.id === `${property}.${value}`
    )[0];
    matOption.deselect();
    // apply removed filter
    this._applyFilter(property.toLowerCase(), value, false);
  }

  private _applyFilter(property: string, value: string, selected: boolean) {
    if (selected) {
      // filter was selected
      this.filterObjects[property].push(value);
    } else {
      // filter was removed
      this.filterObjects[property] = this.filterObjects[property].filter(
        (filterValue) => filterValue !== value
      );
    }
    // Apply filter(s) to applications using pipe
    this.dataSource.data = this._getFilteredData();
  }

  private _getFilteredData(): Application[] {
    return this.filterPipe.transform(this.applications, [
      {
        property: "status",
        value: this.filterObjects.status.join(""),
      },
      {
        property: "source",
        value: this.filterObjects.source.join(""),
      },
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
