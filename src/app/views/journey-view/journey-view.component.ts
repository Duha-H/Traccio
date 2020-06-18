import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
} from "@angular/core";
import { Journey } from "src/app/models/journey";
import { MatSidenav } from "@angular/material/sidenav";
import { UserStoreService } from "src/app/models/user-store.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Application } from "src/app/models/application";
import { STATUS, APP_SOURCE } from "src/app/models/constants";
import { MatSelect } from "@angular/material/select";
import { MatOptionSelectionChange, MatOption } from "@angular/material/core";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ApplicationListComponent } from './application-list.component';
import { BreadcrumbsData } from 'src/app/components/types';

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
  @ViewChild("filterElement", { static: false }) dropdownElement: MatSelect;
  @ViewChildren(MatOption) matOptions!: QueryList<MatOption>;
  @ViewChild(ApplicationListComponent) appList: ApplicationListComponent;

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
  breadcrumbsData: BreadcrumbsData = {
    current: {
      name: '',
      url: ''
    },
    paths: [
      { name: 'Journeys', url: '/journeys' },
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private userStore: UserStoreService,
    private router: Router,
  ) { }

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
    if (!this.journey) {
      console.log("No journey loaded.");
      this.router.navigate(["/journeys"]);
      return;
    } else {
      this.breadcrumbsData.current.name = this.journey.title;
      this.breadcrumbsData.current.url = `/journeys/${this.journey.id}`;
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
      // this.applications = this.journey.applications;
      this.appList.updateView();
    }
  }

  addApplication() {
    this.displayDrawer = true;
    this.drawerMode = DRAWER_MODES.ADD;
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
    this.appList.applyFilters(this.filterObjects);
  }

}
