import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { STATUS, APP_SOURCE } from 'src/app/models/constants';
import { Application } from 'src/app/models/application';
import { UserStoreService } from 'src/app/models/user-store.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'application-input',
  templateUrl: './application-input.component.html',
  styleUrls: ['./application-input.component.css']
})
export class ApplicationInputComponent implements OnChanges {

  // @Input() mode = 'add'; // modes can be either 'add' or 'edit'
  @Input() sidenav: MatSidenav;
  @Input() app: Application;
  @Input() journeyId: number;
  @Output() dataLogged = new EventEmitter<object>();

  STATUSES = Object.values(STATUS);
  SOURCES = Object.values(APP_SOURCE);

  appDetails = {
    company : 'Company Nameeee',
    title : 'Position Title',
    date : [],
    status : STATUS.IN_REVIEW.toString(),
    source : APP_SOURCE.JOB_BOARD.toString(),
    notes : '...',
  };

  startDate = new Date();
  day = this.startDate.getDate();
  month = this.startDate.getMonth() + 1;
  year = this.startDate.getFullYear();

  statuses = [
    {value: STATUS.IN_REVIEW.toString(), viewValue: STATUS.IN_REVIEW.toString()},
    {value: STATUS.INTERVIEW.toString(), viewValue: STATUS.INTERVIEW.toString()},
    {value: STATUS.OFFER.toString(), viewValue: STATUS.OFFER.toString()},
    {value: STATUS.REJECTED.toString(), viewValue: STATUS.REJECTED.toString()},
    {value: STATUS.STALE.toString(), viewValue: STATUS.STALE.toString()}
  ];
  sources = [
    {value: APP_SOURCE.JOB_BOARD.toString(), viewValue: APP_SOURCE.JOB_BOARD.toString()},
    {value: APP_SOURCE.REFERRAL.toString(), viewValue: APP_SOURCE.REFERRAL.toString()},
    {value: APP_SOURCE.FAIR.toString(), viewValue: APP_SOURCE.FAIR.toString()},
    {value: APP_SOURCE.OTHER.toString(), viewValue: APP_SOURCE.OTHER.toString()},
  ];

  invalidTitle = true;

  constructor(private userStore: UserStoreService) {
  }

  ngOnChanges() {
    if (this.app) { // if an application is specified, extract its data
      this.appDetails.title = this.app.positionTitle;
      this.appDetails.date = this.app.appDate;
      this.appDetails.company = this.app.companyName;
      this.appDetails.status = this.app.status;
      this.appDetails.source = this.app.source;
      this.appDetails.notes = this.app.notes;
      console.log("app specified");
    } else {
      this.appDetails.title = 'Position Title';
      this.appDetails.date = [this.startDate[1], this.startDate[0], this.startDate[2]];
      this.appDetails.company = 'Company Name';
      this.appDetails.status = STATUS.IN_REVIEW.toString();
      this.appDetails.source = APP_SOURCE.JOB_BOARD.toString();
      this.appDetails.notes = '...';
    }
    this.startDate = this.appDetails.date.length === 0
      ? new Date()
      : new Date(`${this.appDetails.date[1]}/${this.appDetails.date[0]}/${this.appDetails.date[2]}`);
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.day = event.value.getDate();
    this.month = event.value.getMonth() + 1;
    this.year = event.value.getFullYear();
  }

  onDataLogged() {
    this.appDetails.date = [this.day, this.month, this.year];
    if (!this.app) {
      this.userStore.addNewApplication(this.journeyId, this.appDetails);
    } else {
      this.app.companyName = this.appDetails.company;
      this.app.positionTitle = this.appDetails.title;
      this.app.appDate = this.appDetails.date;
      this.app.status = this.appDetails.status;
      this.app.source = this.appDetails.source;
      this.app.notes = this.appDetails.notes;
      this.userStore.updateExistingApplication(this.journeyId, this.app);
    }
    // TODO: check if everything is fine here
    this.sidenav.close();
    this.startDate = new Date();
  }

  openDatePicker() {
    
  }

}
