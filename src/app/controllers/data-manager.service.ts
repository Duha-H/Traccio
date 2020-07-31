import { Injectable } from "@angular/core";
import { Journey } from "src/app/models/journey";
import { Application } from "src/app/models/application";
import * as utils from "src/app/controllers/utils";
import {
  AppFrequencyDatum,
  WEEKDAYS,
  MONTHS,
  FormattedFrequencyData,
} from "./types";

export interface CalendarDatum {
  day: string;
  value: string;
}
const MS_IN_A_WEEK = 7 * 24 * 60 * 60 * 1000; // milliseconds in a week

@Injectable({
  providedIn: "root",
})
export class DataManagerService {
  // mapping of journey IDs to application (date, count) pairs
  calendarData: { [key: string]: { [key: string]: number } } = {};
  // mapping of journey IDs to application (status, count) pairs
  statusData: { [key: string]: { [key: string]: number } } = {};
  // mapping of journey IDs to (Week, Month, and Year app frequencies)
  // contains data from the past week, month, and year ONLY
  frequencyData: { [key: string]: AppFrequencyDatum } = {};
  statusColors = {
    "In Review": "hsl(213, 70%, 50%)",
    Interview: "hsl(356, 70%, 50%)",
    Offer: "hsl(85, 70%, 50%)",
    Rejected: "hsl(209, 70%, 50%)",
    Ghosted: "hsl(125, 70%, 50%)",
  };

  constructor() {
    // this.frequencyData = this._initFrequencyData();
  }

  collectData(journeys: { [key: string]: any }) {
    // called for initial data setup
    for (const id of Object.keys(journeys)) {
      const { calendarDatum, statusDatum, frequencyDatum } = this._extractData(
        journeys[id].applications
      ); // mapping application date to application count for that date
      this.calendarData[id] = calendarDatum;
      this.statusData[id] = statusDatum;
      this.frequencyData[id] = frequencyDatum;
    }
  }

  addJourney(journey: Journey) {
    const { calendarDatum, statusDatum, frequencyDatum } = this._extractData(
      journey.applications
    );
    this.calendarData[journey.id] = calendarDatum;
    this.statusData[journey.id] = statusDatum;
    this.frequencyData[journey.id] = frequencyDatum;
  }

  removeJourney(journeyid: string) {
    delete this.calendarData[journeyid];
    delete this.statusData[journeyid];
    delete this.frequencyData[journeyid];
  }

  addApplication(journeyid: string, app: Application) {
    const calendarDatum = this.calendarData[journeyid];
    const statusDatum = this.statusData[journeyid];
    const dateString = utils.getDateString(app.appDate);
    const status = app.status;
    if (calendarDatum.hasOwnProperty(dateString)) {
      calendarDatum[dateString] += 1;
    } else {
      calendarDatum[dateString] = 1;
    }
    if (statusDatum.hasOwnProperty(status)) {
      statusDatum[status] += 1;
    } else {
      statusDatum[status] = 1;
    }
    const frequencyDatum = this._updateFrequencyDatum(this.frequencyData[journeyid], app.appDate);
    this.calendarData[journeyid] = calendarDatum; // this may not be necessary
    this.statusData[journeyid] = statusDatum;
    this.frequencyData[journeyid] = frequencyDatum;
  }

  removeApplication(journeyid: string, app: Application) {
    const calendarDatum = this.calendarData[journeyid];
    const statusDatum = this.statusData[journeyid];
    const dateString = utils.getDateString(app.appDate);
    if (calendarDatum && calendarDatum[dateString]) {
      calendarDatum[dateString] -= 1;
      if (calendarDatum[dateString] === 0) {
        // remove date string if count reaches 0
        delete calendarDatum[dateString];
      }
    }
    if (statusDatum && statusDatum[app.status]) {
      statusDatum[app.status] -= 1;
      if (statusDatum[app.status] === 0) {
        // remove date string if count reaches 0
        delete statusDatum[app.status];
      }
    }
    const frequencyDatum = this._updateFrequencyDatum(this.frequencyData[journeyid], app.appDate, 'remove');
    this.calendarData[journeyid] = calendarDatum;
    this.statusData[journeyid] = statusDatum;
    this.frequencyData[journeyid] = frequencyDatum;
  }

  updateExistingApplication(
    journeyid: string,
    prevApp: Application,
    updatedApp: Application
  ) {
    // update calendar and status data
    const dateString = utils.getDateString(prevApp.appDate);
    const newDateString = utils.getDateString(updatedApp.appDate);
    let calendarDatum = this.calendarData[journeyid];
    let statusDatum = this.statusData[journeyid];
    if (dateString !== newDateString) {
      if (calendarDatum && calendarDatum[dateString]) {
        // double-checking that journey & dateString exists
        calendarDatum[dateString] -= 1;
        calendarDatum = this._updateDatum(calendarDatum, newDateString);
      }
    }
    if (prevApp.status !== updatedApp.status) {
      if (statusDatum && statusDatum[prevApp.status]) {
        // double-checking that journey & status exists
        statusDatum[prevApp.status] -= 1;
        statusDatum = this._updateDatum(statusDatum, updatedApp.status);
      }
    }
    this.calendarData[journeyid] = calendarDatum;
    this.statusData[journeyid] = statusDatum;

    // update frequency datum
    if (!utils.datesEqual(prevApp.appDate, updatedApp.appDate)) {
      let updatedFrequencyDatum = this.frequencyData[journeyid];
      updatedFrequencyDatum = this._updateFrequencyDatum(
        updatedFrequencyDatum, prevApp.appDate, 'remove'
      ); // remove old date (if it exists)
      updatedFrequencyDatum = this._updateFrequencyDatum(
        updatedFrequencyDatum, updatedApp.appDate, 'add'
      ); // add the new one (if appropriate)
      this.frequencyData[journeyid] = updatedFrequencyDatum;
    }
  }

  getFormattedCalendarData(
    journeyid: string
  ): { day: string; value: number }[] {
    const result = [];
    const journeyData = Object.assign({}, this.calendarData[journeyid]); // to avoid a potentially non-existent journeyid
    for (const date of Object.keys(journeyData)) {
      result.push({
        day: date,
        value: journeyData[date],
      });
    }
    return result;
  }

  getFormattedStatusData(
    journeyid: string
  ): {
    id: string;
    label: string;
    value: number;
    color: string;
    percentage: string;
  }[] {
    const result = [];
    const journeyData = Object.assign({}, this.statusData[journeyid]); // to avoid a potentially non-existent journeyid
    let total = 0;
    for (const status of Object.keys(journeyData)) {
      result.push({
        id: status,
        label: status,
        value: journeyData[status],
        color: this.statusColors[status],
      });
      total += journeyData[status];
    }
    for (const item of result) {
      const percentage = (item.value / total) * 100;
      item.percentage = `${Math.floor(percentage)}%`;
    }
    return result;
  }

  getFormattedFrequencyData(journeyid: string): FormattedFrequencyData {
    const today = new Date();
    const weekVals = this.frequencyData[journeyid]
      ? Object.values(this.frequencyData[journeyid].week)
      : [];
    const week = [].concat(
      weekVals.slice(today.getUTCDay() + 1),
      weekVals.slice(0, today.getUTCDay() + 1)
    );
    const monthVals = this.frequencyData[journeyid]
    ? Object.values(this.frequencyData[journeyid].month)
    : [];
    const month = [].concat(
      monthVals.slice(today.getUTCDate()), // remember, dates are 1-indexed while arrays are 0-indexed
      monthVals.slice(0, today.getUTCDate())
    );
    const yearVals = this.frequencyData[journeyid]
    ? Object.values(this.frequencyData[journeyid].year)
    : [];
    const year = [].concat(
      yearVals.slice(today.getUTCMonth() + 1),
      yearVals.slice(0, today.getUTCMonth() + 1)
    );
    return {
      week: [{
        id: 'week',
        data: week
      }],
      month: [{
        id: 'month',
        data: month
      }],
      year: [{
        id: 'year',
        data: year
      }],
    };
  }

  private _extractData(
    apps: Application[]
  ): {
    calendarDatum: { [key: string]: number };
    statusDatum: { [key: string]: number };
    frequencyDatum: AppFrequencyDatum;
  } {
    const calendarDatum: { [key: string]: number } = {};
    const statusDatum: { [key: string]: number } = {};
    let frequencyDatum = this._initFrequencyData();
    apps.forEach((app) => {
      const dateString = utils.getDateString(app.appDate);
      if (calendarDatum.hasOwnProperty(dateString)) {
        calendarDatum[dateString] += 1;
      } else {
        calendarDatum[dateString] = 1;
      }
      const status = app.status;
      if (statusDatum.hasOwnProperty(status)) {
        statusDatum[status] += 1;
      } else {
        statusDatum[status] = 1;
      }
      frequencyDatum = this._updateFrequencyDatum(frequencyDatum, app.appDate);
    });

    return {
      calendarDatum,
      statusDatum,
      frequencyDatum,
    };
  }

  private _updateDatum(datum: { [key: string]: number }, property: string) {
    if (datum.hasOwnProperty(property)) {
      datum[property] += 1;
    } else {
      datum[property] = 1;
    }
    return datum;
  }

  private _initFrequencyData(): AppFrequencyDatum {
    const result: AppFrequencyDatum = {
      week: {},
      month: {},
      year: {},
    };
    const today = new Date();
    // week
    let weekdayIdx = today.getUTCDay();
    for (let i = 0; i < 7; i++) {
      result.week[weekdayIdx] = {
        x: WEEKDAYS[weekdayIdx],
        y: 0,
        label: undefined,
      };
      weekdayIdx = weekdayIdx === 6 ? 0 : weekdayIdx + 1;
    }
    // month
    const daysInMonth = new Date(
      today.getUTCFullYear(),
      today.getUTCMonth() + 1, // adding 1 because getUTCMonth() returns 0-indexed months
      0
    ).getDate();
    let dayIdx = today.getUTCDate();
    for (let i = 1; i <= daysInMonth; i++) {
      result.month[dayIdx] = {
        x: dayIdx.toString(),
        y: 0,
      };
      dayIdx = dayIdx === daysInMonth ? 1 : dayIdx + 1;
    }
    // year
    let monthIdx = today.getUTCMonth() + 1;
    for (let i = 1; i <= 12; i++) {
      result.year[monthIdx] = {
        x: MONTHS[monthIdx],
        y: 0,
      };
      monthIdx = monthIdx === 12 ? 1 : monthIdx + 1;
    }
    return result;
  }

  private _updateFrequencyDatum(
    datum: AppFrequencyDatum,
    appDate: Date,
    mode?: 'add' | 'remove'
  ): AppFrequencyDatum {
    if (!datum) {
      return;
    }
    if (!mode) {
      mode = 'add';
    }
    const updatedDatum = datum;
    const weekday = appDate.getUTCDay();
    const day = appDate.getUTCDate();
    const month = appDate.getUTCMonth() + 1;
    const year = appDate.getUTCFullYear();
    if (mode === 'add') {
      if (this._dateInPastYear(appDate)) { // application sent in the past 365 days
        updatedDatum.year[month].y += 1;
        updatedDatum.year[month].label = `${MONTHS[month]}, ${year}`;

        if (this._dateInPastMonth(appDate)) { // application sent in the past 30/31 days
          updatedDatum.month[day].y += 1;
          updatedDatum.month[day].label = `${MONTHS[month]} ${day}`;

          if (this._dateInPastWeek(appDate)) { // application sent in the past 7 days
            updatedDatum.week[weekday].y += 1;
            updatedDatum.week[weekday].label = `${MONTHS[month]} ${day}`;
          }
        }
      }
    } else if (mode === 'remove') { // remove
      if (this._dateInPastYear(appDate)) { // application sent in the past 365 days
        updatedDatum.year[month].y -= 1;

        if (this._dateInPastMonth(appDate)) { // application sent in the past 30/31 days
          updatedDatum.month[day].y -= 1;

          if (this._dateInPastWeek(appDate)) { // application sent in the past 7 days
            updatedDatum.week[weekday].y -= 1;
          }
        }
      }
    }

    return updatedDatum;
  }

  private _dateInPastWeek(date: Date) {
    // returns true if applicate DATE is WITHIN the past 7 days
    const diff = new Date().getTime() - date.getTime();
    if (diff <= MS_IN_A_WEEK) {
      return true;
    } else {
      return false;
    }
  }

  private _dateInPastMonth(date: Date) {
    // returns true if application DATE is WITHIN the past 30/31 days (month dependent)
    const today = new Date();
    const dayAMonthAgo =
      today.getUTCMonth() === 0
        ? new Date(today.getUTCFullYear() - 1, 11, today.getUTCDate())
        : new Date(
            today.getUTCFullYear(),
            today.getUTCMonth() - 1,
            today.getUTCDate()
          );
    if (
      date.getTime() >= dayAMonthAgo.getTime() &&
      date.getTime() <= today.getTime()
    ) {
      return true;
    } else {
      return false;
    }
  }

  private _dateInPastYear(date: Date) {
    // returns true if applcation DATE is WITHIN the past 365 days
    const today = new Date();
    const dayAYearAgo = new Date(
      today.getUTCFullYear() - 1,
      today.getUTCMonth(),
      today.getUTCDate()
    );
    if (
      date.getTime() >= dayAYearAgo.getTime() &&
      date.getTime() <= today.getTime()
    ) {
      return true;
    } else {
      return false;
    }
  }
}
