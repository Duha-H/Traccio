import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
  OnDestroy
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
import { BreadcrumbsData } from 'src/app/shared-components/types';
import { ResizeService } from 'src/app/controllers/resize.service';
import { Title } from '@angular/platform-browser';

const DRAWER_MODES = {
  ADD: "add",
  EDIT: "edit",
}; // don't want to take any chances

@Component({
  selector: "app-journey-view",
  templateUrl: "./journey-view.component.html",
  styleUrls: ["./journey-view.component.css"],
})
export class JourneyViewComponent implements OnInit, AfterViewInit {
  @ViewChild("editButton") editButton: ElementRef;
  @ViewChild("sidenav", { static: false }) sidenav: MatSidenav;
  @ViewChild("filterElement", { static: false }) dropdownElement: MatSelect;
  @ViewChildren(MatOption) matOptions!: QueryList<MatOption>;
  @ViewChild(ApplicationListComponent) appList: ApplicationListComponent;

  viewMode: "edit" | "view" = "view";
  journey: Journey = new Journey();
  currJourneyDetails = Object.assign(new Journey(), this.journey);
  applications: Application[];
  startDate: string;
  endDate: string;
  iconClass: string;
  displayDrawer = false;
  drawerMode = DRAWER_MODES.ADD;
  today = new Date();
  selectedApp;
  deleteButtonPressed = false;
  statusFilterDropdown = [
    { value: STATUS.IN_REVIEW, viewValue: STATUS.IN_REVIEW },
    { value: STATUS.ASSESSMENT, viewValue: STATUS.ASSESSMENT },
    { value: STATUS.INTERVIEW, viewValue: STATUS.INTERVIEW },
    { value: STATUS.OFFER, viewValue: STATUS.OFFER },
    { value: STATUS.REJECTED, viewValue: STATUS.REJECTED },
    { value: STATUS.STALE, viewValue: STATUS.STALE },
  ];
  sourceFilterDropdown = [
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
  ];
  filterDropdown = [
    {
      name: "Status",
      items: [
        { value: STATUS.IN_REVIEW, viewValue: STATUS.IN_REVIEW },
        { value: STATUS.ASSESSMENT, viewValue: STATUS.ASSESSMENT },
        { value: STATUS.INTERVIEW, viewValue: STATUS.INTERVIEW },
        { value: STATUS.OFFER, viewValue: STATUS.OFFER },
        { value: STATUS.REJECTED, viewValue: STATUS.REJECTED },
        { value: STATUS.STALE, viewValue: STATUS.STALE },
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
      { name: 'Journeys', url: '/home/journeys' },
    ]
  };
  displayEditOverlay = false;
  displayFilterOverlay = false;
  visibleAppCount = '0 applications';

  constructor(
    private route: ActivatedRoute,
    private userStore: UserStoreService,
    private router: Router,
    public rs: ResizeService,
    private titleService: Title,
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Journey | Traccio');
    let id: string;
    let appref: string;
    // extract journey ID from URL, then get journey from UserStore
    this.route.params.subscribe((params) => {
      id = params.id;
      if (params.appref) {
        appref = params.appref;
      }
      return params.id;
    });
    this.userStore.journeys.subscribe(journeys => {
      const journey = this.userStore.getJourney(id);
      if (journey) {
        this.journey = journey;
        this.titleService.setTitle(`${this.journey.title} | Traccio`);
        this.breadcrumbsData.current.name = this.journey.title;
        this.breadcrumbsData.current.url = `/home/journeys/${this.journey.id}`;
        this.selectedApp = this.userStore.getApplication(
          this.journey.id,
          appref
        );
        if (appref && this.selectedApp) {
          this.displayDrawer = true;
        }
        this.updateApplicationCount(this.journey.applications.length);
      }
    });
    this.currJourneyDetails = Object.assign(new Journey(), this.journey);
    sessionStorage.setItem('journeyRoute', `/home/journeys/${this.journey.id}`);
  }

  ngAfterViewInit() {
    this.updateApplicationCount(this.appList.dataSource.data.length);
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
    const selectedDate = event.value;
    const today = new Date();
    if (selectedDate && selectedDate.getTime() <= today.getTime()) {
      this.currJourneyDetails.active = false;
    } else if (selectedDate && selectedDate.getTime() > today.getTime()) {
      this.currJourneyDetails.active = true;
    }
  }

  saveJourneyUpdates() {
    this.journey = this.currJourneyDetails;
    this.userStore.updateExistingJourney(this.currJourneyDetails);
    this.displayEditOverlay = false;
  }

  toggleJourneyActive() {
    if (this.currJourneyDetails.active) {
      this.currJourneyDetails.active = false;
      this.currJourneyDetails.endDate = this.today;
    } else {
      this.currJourneyDetails.active = true;
      this.currJourneyDetails.endDate = undefined;
    }
  }

  updateView() {
    if (this.journey) {
      this.currJourneyDetails = Object.assign(new Journey(), this.journey);
      this.appList.updateView();
    }
  }

  addApplication() {
    this.router.navigate(['/home/journeys', this.journey.id, 'new-app']);
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

  showEditOverlay() {
    this.currJourneyDetails = Object.assign(new Journey(), this.journey);
    this.displayEditOverlay = true;
  }

  navigateToApplication(application: Application) {
    this.router.navigate(['/home/journeys', this.journey.id, application.id]);
  }

  addFilter(event: MatOptionSelectionChange, group: string) {
    this.dropdownElement.close();
    // const group = event.source.group.label.toLowerCase();
    group = group.toLowerCase();
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

  updateApplicationCount(count?: number) {
    if (count !== undefined) {
      this.visibleAppCount = count === 1 ? '1 application' : count + ' applications';
    }
    return this.visibleAppCount;
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
