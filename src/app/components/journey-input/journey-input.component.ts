import { Component, OnChanges, Output, EventEmitter, Input } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Journey } from 'src/app/models/journey';
import { UserStoreService } from 'src/app/models/user-store.service';

@Component({
  selector: 'journey-input',
  templateUrl: './journey-input.component.html',
  styleUrls: ['./journey-input.component.css']
})
export class JourneyInputComponent implements OnChanges {

  @Input() journey: Journey;
  @Output() newDataLogged = new EventEmitter<object>();
  @Output() updateDataLogged = new EventEmitter<object>();

  minDate: Date;
  maxDate: Date;
  today = new Date();
  title = '';
  // day = this.today.getDate();
  // month = this.today.getMonth() + 1;
  // year = this.today.getFullYear();
  // displayDate = new Date(`${this.month + 1}/${this.day}/${this.year}`);
  startDate = new Date();
  endDate = new Date();
  active = true;

  constructor(private userStore: UserStoreService) {
    const thisYear = new Date().getFullYear();
    this.minDate = new Date(thisYear - 20, 0, 1);
    this.maxDate = new Date(thisYear, 11, 31);
  }

  ngOnChanges() {
    if (this.journey) {
      // this.day = this.journey.startDate[0];
      // this.month = this.journey.startDate[1];
      // this.year = this.journey.startDate[2];
      console.log("new journey", this.journey);
      this.active = this.journey.active;
      this.title = this.journey.title;
      this.startDate = new Date(`${this.journey.startDate[1]}/${this.journey.startDate[0]}/${this.journey.startDate[2]}`);
      this.endDate = this.journey.endDate.length === 0
        ? new Date()
        : new Date(`${this.journey.endDate[1]}/${this.journey.endDate[0]}/${this.journey.endDate[2]}`);
    }
    // this.displayDate = new Date(`${this.month}/${this.day}/${this.year}`);
  }

  onDataLogged() {
    // console.log(this.title, this.day, this.month, this.year);
    if (this.title === "") {
      console.log("error: no title specifed");
    } else {
      if (this.journey) {
        this.journey.title = this.title;
        this.journey.startDate = [
          this.startDate.getDate(),
          this.startDate.getMonth() + 1,
          this.startDate.getFullYear()];
        this.journey.active = this.active;
        if (!this.active) {
          this.journey.endDate = [
            this.endDate.getDate(),
            this.endDate.getMonth() + 1,
            this.endDate.getFullYear(),
          ];
        } else {
          this.journey.endDate = [];
        }
        this.userStore.updateExistingJourney(this.journey);
        this.updateDataLogged.emit(this.journey);
      } else {
        const newJourney = {
          title: this.title,
          startDate: [
            this.startDate.getDate(),
            this.startDate.getMonth() + 1,
            this.startDate.getFullYear()],
          active: this.active,
          endDate: [],
        };
        if (!newJourney.active) {
          newJourney.endDate = [
            this.endDate.getDate(),
            this.endDate.getMonth() + 1,
            this.endDate.getFullYear(),
          ];
        }
        this.userStore.addNewJourney(newJourney);
        this.newDataLogged.emit(newJourney); // HERE
      }
      this.resetData();
    }
  }

  resetData() {
    this.title = '';
    this.startDate = new Date();
    this.endDate = new Date();
    this.active = true;
    this.journey = null;
    // this.day = this.today.getDate();
    // this.month = this.today.getMonth() + 1;
    // this.year = this.today.getFullYear();
  }

  dateChange(event: MatDatepickerInputEvent<Date>) {
    // this.day = event.value.getDate();
    // this.month = event.value.getMonth() + 1;
    // this.year = event.value.getFullYear();
  }

}
