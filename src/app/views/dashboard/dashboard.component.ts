import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { UserStoreService } from "src/app/models/user-store.service";
import * as mockData from "src/app/models/data";
import { Journey } from "src/app/models/journey";
import { STATUS } from "src/app/models/constants";
import { Application } from 'src/app/models/application';
import { Router } from '@angular/router';
import { PreferencesStoreService } from 'src/app/controllers/preferences-store.service';
import { PALETTES, THEMES } from 'src/styling/palettes';
import { ResizeService } from 'src/app/controllers/resize.service';
import { FormattedFrequencyData, WEEKDAYS, MONTHS } from 'src/app/controllers/types';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  name = "";
  pieChartData = mockData.pieChartData;
  activeJourneys: Journey[];
  selectedJourney: JourneyDropdownItem;
  dropdownContent: JourneyDropdownItem[] = [];
  currentYear: string = new Date().getFullYear().toString();
  from: string;
  to: string;
  statuses = [
    {value: '', viewValue: 'All Statuses'},
    {value: STATUS.IN_REVIEW.toString(), viewValue: STATUS.IN_REVIEW.toString()},
    {value: STATUS.INTERVIEW.toString(), viewValue: STATUS.INTERVIEW.toString()},
    {value: STATUS.OFFER.toString(), viewValue: STATUS.OFFER.toString()},
    {value: STATUS.REJECTED.toString(), viewValue: STATUS.REJECTED.toString()},
    {value: STATUS.STALE.toString(), viewValue: STATUS.STALE.toString()}
  ];
  selectedStatus = this.statuses[0];
  theme = THEMES.light;
  pieChartPalette = ['#AC98FB', '#6E89F8', '#81BEFA', '#C1E0F8', '#D1C3EB'];
  calendarPalette = ['#AC98FB', '#6E89F8', '#81BEFA', '#C1E0F8', '#D1C3EB'];
  lineChartMode: 'week' | 'month' | 'year' = 'week';
  weekAxis = [];
  monthAxis = [];
  yearAxis = [];

  @ViewChild('statusContainer') statContainer: ElementRef;

  constructor(
    private userStore: UserStoreService,
    private router: Router,
    private prefStore: PreferencesStoreService,
    public resizeService: ResizeService
  ) {}

  ngOnInit() {
    try {
      this.userStore.user.subscribe(user => {
        this.name = user.firstName;
      });
      this.userStore.activeJourneys.subscribe((activeJourneys) => {
        this.activeJourneys = activeJourneys;
        this.setDropdownContent();
        this.selectedJourney = this.dropdownContent[0];
        this.currentYear = this.selectedJourney && this.selectedJourney.years[0]
          ? this.selectedJourney.years[this.selectedJourney.years.length - 1]
          : this.currentYear;
        if (this.selectedJourney) {
          this._setLineChartAxes(this.selectedJourney.frequencyData);
        }
      });
      this.prefStore.preferences.subscribe(preferences => {
        this.theme = preferences.theme;
        this.pieChartPalette = preferences.colorPalette.colors;
        this.calendarPalette = [this.theme.emptyColor, ...preferences.colorPalette.colors];
      });
      // console.log(this.selectedJourney.frequencyData);
      console.log("Dashboard initialized");
    } catch (error) {
      console.log("User not defined yet:", error); // should probably make sure this never happens
      this.name = '';
      this.activeJourneys = [];
    }
  }

  setDropdownContent() {
    const newContent: JourneyDropdownItem[] = [];
    this.activeJourneys.forEach((journey) => {
      const journeyData = this.userStore.getCalendarData(journey.id);
      const journeyStatusData = this.userStore.getStatusData(journey.id);
      const frequencyData = this.userStore.getFrequencyData(journey.id);
      newContent.push({
        value: journey,
        viewValue: journey.title,
        calendarData: journeyData,
        years: this._setCalendarYears(journeyData),
        statusData: journeyStatusData,
        frequency: this._getApplicationFrequency(journey.startDate, journey.applications.length),
        frequencyData,
      });
    });
    this.dropdownContent = newContent;
  }

  selectYear(year: string) {
    this.currentYear = year ? year : new Date().getUTCFullYear().toString();
  }

  selectApplication(app: Application) {
    this.router.navigate(['/journeys', this.selectedJourney.value.id, app.id]);
  }

  isEmpty(obj: {[key: string]: any}) {
    return (obj && Object.keys(obj).length === 0);
  }

  toggleLineChartMode() {
    switch (this.lineChartMode) {
      case 'week':
        this.lineChartMode = 'month';
        break;
      case 'month':
        this.lineChartMode = 'year';
        break;
      case 'year':
        this.lineChartMode = 'week';
        break;
      default:
        break;
    }
  }

  private _setLineChartAxes(frequencyData: FormattedFrequencyData) {
    const weekYVals = frequencyData.week[0].data.map(value => value.y);
    this.weekAxis = frequencyData.week[0].data.map(value => value.y);
    this.monthAxis = frequencyData.month[0].data.map(value => value.x);
    this.yearAxis = frequencyData.year[0].data.map(value => value.x);
  }

  private _setCalendarYears(data: { day: string; value: number }[]): string[] {
    const years = [];
    data.sort((a, b) => {
      return a.day > b.day ? 1 : -1;
    });
    if (data.length === 0) {
      return years;
    }
    // okay, we can't be parsing a date string because that creates unpredictable messes
    // so we're gonna use the date string to create a new Date object, then extract the year from that
    const startYear = new Date(data[0].day).getUTCFullYear(); // extract year as a number
    const endYear = new Date(data[data.length - 1].day).getUTCFullYear();
    for (let i = startYear; i <= endYear; i++) {
      years.push(i);
    }
    return years;
  }

  private _getApplicationFrequency(startDate: Date, count: number): string {
    let daysElapsed = (new Date()).getTime() - startDate.getTime(); // returns difference in milliseconds
    daysElapsed = Math.floor(daysElapsed / (1000 * 3600 * 24)); // convert
    const result = daysElapsed === 0
      ? count.toFixed(2)  // if no days have passed, frequency is number of apps submitted today
      : (count / daysElapsed).toFixed(2);
    return result;
  }
}

export interface JourneyDropdownItem {
  value: Journey;
  viewValue: string;
  calendarData: object;
  years: string[];
  statusData: object;
  frequency: string;
  frequencyData: FormattedFrequencyData;
}
