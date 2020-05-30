import { Component, OnInit } from "@angular/core";
import { UserStoreService } from "src/app/models/user-store.service";
import * as mockData from "../../models/data";
import { Journey } from "../../models/journey";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  name = "";
  data = mockData.data;
  pieChartData = mockData.pieChartData;
  yearSpacing = 40;
  dayBorderWidth = 2;
  activeJourneys: Journey[];
  selectedJourney: {
    value: Journey;
    viewValue: string;
    calendarData: object;
    years: string[];
    statusData: object;
    frequency: string;
  };
  dropdownContent: {
    value: Journey;
    viewValue: string;
    calendarData: object;
    years: string[];
    statusData: object;
    frequency: string;
  }[] = [];
  currentYear: string = new Date().getFullYear().toString();
  from: string;
  to: string;

  constructor(private userStore: UserStoreService) {}

  ngOnInit() {
    try {
      this.name = this.userStore.user.firstName;
      this.userStore.activeJourneys.subscribe((activeJourneys) => {
        this.activeJourneys = activeJourneys;
        this.setDropdownContent();
      });
      this.selectedJourney = this.dropdownContent[0];
      this.currentYear = this.selectedJourney.years[0]
        ? this.selectedJourney.years[0]
        : this.currentYear;
      console.log("dashboard init");
    } catch (error) {
      console.log("User not defined yet:", error); // should probably make sure this never happens
    }
  }

  setDropdownContent() {
    const newContent: {
      value: Journey;
      viewValue: string;
      calendarData: object;
      years: string[];
      statusData: object;
      frequency: string;
    }[] = [];
    this.activeJourneys.forEach((journey) => {
      const journeyData = this.userStore.getCalendarData(journey.id);
      const journeyStatusData = this.userStore.getStatusData(journey.id);
      newContent.push({
        value: journey,
        viewValue: journey.title,
        calendarData: journeyData,
        years: this._setCalendarYears(journeyData),
        statusData: journeyStatusData,
        frequency: this._getApplicationFrequency(journey.startDate, journey.applications.length),
      });
    });
    this.dropdownContent = newContent;
  }

  selectYear(year: string) {
    this.currentYear = year ? year : new Date().getFullYear().toString();
  }

  private _setCalendarYears(data: { day: string; value: number }[]): string[] {
    const years = [];
    data.sort((a, b) => {
      return a.day > b.day ? 1 : -1;
    });
    if (data.length === 0) {
      return years;
    }
    const startYear = +data[0].day.split("-")[0]; // extract year as a number
    const endYear = +data[data.length - 1].day.split("-")[0];
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
    console.log(result, count, daysElapsed);
    return result;
  }
}
