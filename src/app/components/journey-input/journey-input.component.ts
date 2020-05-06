import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Journey } from 'src/app/models/journey';

@Component({
  selector: 'journey-input',
  templateUrl: './journey-input.component.html',
  styleUrls: ['./journey-input.component.css']
})
export class JourneyInputComponent implements OnInit {

  @Input() journey: Journey;
  @Output() dataLogged = new EventEmitter<object>();

  minDate: Date;
  maxDate: Date;
  today = new Date();
  title = '';
  day = this.today.getDate();
  month = this.today.getMonth() + 1;
  year = this.today.getFullYear();
  active = true;

  constructor() {
    const thisYear = new Date().getFullYear();
    this.minDate = new Date(thisYear - 20, 0, 1);
    this.maxDate = new Date(thisYear, 11, 31);
  }

  ngOnInit() {
  }

  onDataLogged() {
    // console.log(this.title, this.day, this.month, this.year);
    if (this.title === "") {
      console.log("error: no title specifed");
    } else {
      const newJourney = {
        title: this.title,
        startDate: [
          this.day,
          this.month,
          this.year],
        endDate: null,
        active: this.active,
      };
      this.dataLogged.emit(newJourney); // HERE
      this.resetData();
    }
  }

  resetData() {
    this.title = '';
    this.day = this.today.getDate();
    this.month = this.today.getMonth() + 1;
    this.year = this.today.getFullYear();
  }

  dateChange(event: MatDatepickerInputEvent<Date>) {
    this.day = event.value.getDate();
    this.month = event.value.getMonth() + 1;
    this.year = event.value.getFullYear();
  }

}
