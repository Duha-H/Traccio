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
      console.log("new journey", this.journey);
      this.active = this.journey.active;
      this.title = this.journey.title;
      this.startDate = new Date(
        `${this.journey.startDate[1]}/${this.journey.startDate[0]}/${this.journey.startDate[2]}`
      );
      this.endDate =
        this.journey.endDate.length === 0
          ? new Date()
          : new Date(
              `${this.journey.endDate[1]}/${this.journey.endDate[0]}/${this.journey.endDate[2]}`
            );
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
      newJourney.startDate = [
        this.startDate.getDate(),
        this.startDate.getMonth() + 1,
        this.startDate.getFullYear(),
      ];
      newJourney.active = this.active;
      if (!this.active) {
        newJourney.endDate = [
          this.endDate.getDate(),
          this.endDate.getMonth() + 1,
          this.endDate.getFullYear(),
        ];
      } else {
        newJourney.endDate = [];
      }
      this.newDataLogged.emit(newJourney);
      this.resetData();
    }
  }

  resetData() {
    this.title = "";
    this.startDate = new Date();
    this.endDate = new Date();
    this.active = true;
    this.journey = null;
  }

  dateChange(event: MatDatepickerInputEvent<Date>) {
    // this.day = event.value.getDate();
    // this.month = event.value.getMonth() + 1;
    // this.year = event.value.getFullYear();
  }
}
