import { Injectable } from '@angular/core';
import { Journey } from '../models/journey';
import { Application } from '../models/application';
import { STATUS } from '../models/constants';

export interface CalendarDatum {
  day: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataManagerService {

  // mapping of journey IDs to application (date, count) pairs
  calendarData: {[key: string]: {[key: string]: number}} = {};
  // mapping of journey IDs to application (status, count) pairs
  statusData: {[key: string]: {[key: string]: number}} = {};
  statusColors = {
    "In Review": "hsl(213, 70%, 50%)",
    "Interview": "hsl(356, 70%, 50%)",
    "Offer": "hsl(85, 70%, 50%)",
    "Rejected": "hsl(209, 70%, 50%)",
    "Ghosted": "hsl(125, 70%, 50%)",
  };

  constructor() { }

  collectData(journeys: {[key: string]: any}) {
    // called for initial data setup
    for (const id of Object.keys(journeys)) {
      const { calendarDatum, statusDatum } =
        this._extractData(journeys[id].applications); // mapping application date to application count for that date
      this.calendarData[id] = calendarDatum;
      this.statusData[id] = statusDatum;
    }
  }

  addJourney(journey: Journey) {
    const { calendarDatum, statusDatum } = this._extractData(journey.applications);
    this.calendarData[journey.id] = calendarDatum;
    this.statusData[journey.id] = statusDatum;
  }

  removeJourney(journeyid: string) {
    delete this.calendarData[journeyid];
    delete this.statusData[journeyid];
  }

  addApplication(journeyid: string, app: Application) {
    const calendarDatum = this.calendarData[journeyid];
    const statusDatum = this.statusData[journeyid];
    const dateString = app.appDate.toISOString().split('T')[0];
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
    this.calendarData[journeyid] = calendarDatum; // this may not be necessary
    this.statusData[journeyid] = statusDatum;
  }

  removeApplication(journeyid: string, app: Application) {
    const calendarDatum = this.calendarData[journeyid];
    const statusDatum = this.statusData[journeyid];
    const dateString = app.appDate.toISOString().split('T')[0];
    if (calendarDatum && calendarDatum[dateString]) {
      calendarDatum[dateString] -= 1;
      if (calendarDatum[dateString] === 0) { // remove date string if count reaches 0
        delete calendarDatum.dateString;
      }
    }
    if (statusDatum && statusDatum[app.status]) {
      statusDatum[app.status] -= 1;
      if (statusDatum[app.status] === 0) { // remove date string if count reaches 0
        delete statusDatum[app.status];
      }
    }
  }

  updateExistingApplication(journeyid: string, prevApp: Application, updatedApp: Application) {
    const dateString = prevApp.appDate.toISOString().split('T')[0];
    const newDateString = updatedApp.appDate.toISOString().split('T')[0];
    let calendarDatum = this.calendarData[journeyid];
    let statusDatum = this.statusData[journeyid];
    if (dateString !== newDateString) {
      if (calendarDatum && calendarDatum[dateString]) { // double-checking that journey & dateString exists
        calendarDatum[dateString] -= 1;
        calendarDatum = this._updateDatum(calendarDatum, newDateString);
      }
    }
    if (prevApp.status !== updatedApp.status) {
      if (statusDatum && statusDatum[prevApp.status]) { // double-checking that journey & status exists
        statusDatum[prevApp.status] -= 1;
        statusDatum = this._updateDatum(statusDatum, updatedApp.status);
      }
    }
    this.calendarData[journeyid] = calendarDatum;
    this.statusData[journeyid] = statusDatum;
  }

  getFormattedCalendarData(journeyid: string): { day: string; value: number; }[] {
    const result = [];
    const journeyData = this.calendarData[journeyid];
    for (const date of Object.keys(journeyData)) {
      result.push({
        day: date,
        value: journeyData[date]
      });
    }
    return result;
  }

  getFormattedStatusData(journeyid: string): {
    id: string,
    label: string,
    value: number,
    color: string
  }[] {
    const result = [];
    const journeyData = this.statusData[journeyid];
    for (const status of Object.keys(journeyData)) {
      result.push({
        id: status,
        label: status,
        value: journeyData[status],
        color: this.statusColors[status],
      });
    }
    return result;
  }

  private _extractData(apps: Application[]): {
    calendarDatum: {[key: string]: number},
    statusDatum: {[key: string]: number}
  } {
    const calendarDatum: {[key: string]: number} = {};
    const statusDatum: {[key: string]: number} = {};
    apps.forEach(app => {
      const dateString = app.appDate.toISOString().split('T')[0];
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
    });
    return {
      calendarDatum,
      statusDatum
    };
  }

  private _updateDatum(datum: {[key: string]: number}, property: string) {
    if (datum.hasOwnProperty(property)) {
      datum[property] += 1;
    } else {
      datum[property] = 1;
    }
    return datum;
  }

}
