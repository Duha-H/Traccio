import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnInit
} from "@angular/core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { Journey } from "src/app/models/journey";
import { OnDirtyErrorStateMatcher } from 'src/app/controllers/on-dirty-error-state-matcher';
import { Response } from 'src/app/utils/response';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: "journey-input",
  templateUrl: "./journey-input.component.html",
  styleUrls: ["./journey-input.component.css"],
})
export class JourneyInputComponent implements OnInit {
  @Input() journey: Journey;
  @Output() newDataLogged = new EventEmitter<object>();
  @Output() updateDataLogged = new EventEmitter<object>();

  minDate: Date;
  maxDate: Date;
  today = new Date();
  title = '';
  startDate = new Date();
  endDate = undefined;
  active = true;
  errorStateMatcher = new OnDirtyErrorStateMatcher();
  response = new Response();

  constructor() {
    const thisYear = new Date().getFullYear();
    this.minDate = new Date(thisYear - 20, 0, 1);
    this.maxDate = new Date(thisYear, 11, 31);
  }

  ngOnInit() { }

  onDataLogged() {
    if (!this.title) {
      this.response.error('A journey title must be specified');
    } else if (!this.startDate) {
      this.response.error('Start date is not specified or invalid');
    } else if (!this.active && !this.endDate) {
      this.response.error('Since the journey is inactive, an end date must be specified');
    } else {
      const newJourney: { [key: string]: any } = {};
      if (this.journey) { // if updating existing journey, copy over ID and apps
        newJourney.id = this.journey.id;
        newJourney.applications = this.journey.applications;
      }
      // copy over updated journey details from input
      newJourney.title = this.title;
      newJourney.startDate = this.startDate;
      newJourney.active = this.active;
      if (!this.active) {
        newJourney.endDate = this.endDate;
      } else {
        newJourney.endDate = undefined;
      }
      this.newDataLogged.emit(newJourney);
      this.resetData();
    }
  }

  resetData() {
    this.title = "";
    this.startDate = new Date();
    this.endDate = undefined;
    this.active = true;
    this.journey = null;
  }

  dateChange(event: MatDatepickerInputEvent<Date>, type: 'start' | 'end') {
    const date = event.value;
    if (date instanceof Date) {
      if (type === 'end') {
        this.active = false;
      }
      this.response.success();
    } else {
      this.response.error('Date is invalid, it must have the format MM/DD/YYYY');
    }
  }

  onActiveToggle(event: MatCheckboxChange) {
    if (!event.checked) {
      this.endDate = new Date();
    } else {
      this.endDate = undefined;
    }
    this.response.success();
  }
}
