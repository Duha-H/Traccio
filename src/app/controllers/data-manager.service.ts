import { Injectable } from '@angular/core';
import { Journey } from '../models/journey';
import { Application } from '../models/application';

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

  constructor() { }

  collectData(journeys: {[key: string]: any}) {
    // called for initial data setup
    for (const id of Object.keys(journeys)) {
      const currData: {[key: string]: number} =
        this._extractDates(journeys[id].applications); // mapping application date to application count for that date
      this.calendarData[id] = currData;
    }
  }

  addJourney(journey: Journey) {
    const calendarDatum: {[key: string]: number} = this._extractDates(journey.applications);
    this.calendarData[journey.id] = calendarDatum;
  }

  addApplication(journeyid: string, app: Application) {
    const calendarDatum = this.calendarData[journeyid];
    const dateString = app.appDate.toISOString().split('T')[0];
    if (calendarDatum.hasOwnProperty(dateString)) {
      calendarDatum[dateString] += 1;
    } else {
      calendarDatum[dateString] = 1;
    }
    this.calendarData[journeyid] = calendarDatum; // this may not be necessary
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

  private _extractDates(apps: Application[]): {[key: string]: number} {
    const calendarDatum: {[key: string]: number} = {};
    apps.forEach(app => {
      const dateString = app.appDate.toISOString().split('T')[0];
      if (calendarDatum.hasOwnProperty(dateString)) {
        calendarDatum[dateString] += 1;
      } else {
        calendarDatum[dateString] = 1;
      }
    });
    return calendarDatum;
  }
}
