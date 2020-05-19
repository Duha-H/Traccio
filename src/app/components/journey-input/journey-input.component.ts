import {
  Component,
  OnChanges,
  Output,
  EventEmitter,
  Input,
} from "@angular/core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { Journey } from "src/app/models/journey";
import { UserStoreService } from "src/app/models/user-store.service";
import { OnDirtyErrorStateMatcher } from 'src/app/controllers/on-dirty-error-state-matcher';

@Component({
  selector: "journey-input",
  templateUrl: "./journey-input.component.html",
  styleUrls: ["./journey-input.component.css"],
})
export class JourneyInputComponent implements OnChanges {
  @Input() journey: Journey;
  @Output() newDataLogged = new EventEmitter<object>();
  @Output() updateDataLogged = new EventEmitter<object>();

  minDate: Date;
  maxDate: Date;
  today = new Date();
  title = '';
  startDate = undefined;
  endDate = undefined;
  active = true;
  errorStateMatcher = new OnDirtyErrorStateMatcher();

  constructor(private userStore: UserStoreService) {
    const thisYear = new Date().getFullYear();
    this.minDate = new Date(thisYear - 20, 0, 1);
    this.maxDate = new Date(thisYear, 11, 31);
  }

  ngOnChanges() {
    if (this.journey) {
      console.log("new journey", this.journey);
      this.active = this.journey.active;
      this.title = this.journey.title;
      this.startDate = this.journey.startDate;
      this.endDate = this.journey.endDate
        ? this.journey.endDate
        : new Date();
    } else {
      this.resetData(); // make sure all fields are clean
    }
  }

  onDataLogged() {
    if (this.title === "") {
      console.log("error: no title specifed");
    } else {
      const newJourney: { [key: string]: any } = {};
      if (this.journey) { // if updating existing journey, copy over ID and apps
        newJourney.id = this.journey.id;
        newJourney.applications = this.journey.applications;
        console.log("apps:", newJourney.applications);
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
    this.startDate = undefined;
    this.endDate = undefined;
    this.active = true;
    this.journey = null;
  }

  dateChange(event: MatDatepickerInputEvent<Date>) {
    // this.day = event.value.getDate();
    // this.month = event.value.getMonth() + 1;
    // this.year = event.value.getFullYear();
  }
}
