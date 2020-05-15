import { Component, OnInit, OnChanges } from "@angular/core";
import { UserStoreService } from "../../models/user-store.service";
import { Journey } from "src/app/models/journey";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { map, pluck, flatMap, mergeMap } from 'rxjs/operators';

@Component({
  selector: "app-journey-list",
  templateUrl: "./journey-list.component.html",
  styleUrls: ["./journey-list.component.css"],
})
export class JourneyListComponent implements OnInit {

  displayDrawer = false;
  currJourney: Journey = null;
  journeys: Observable<Journey[]>;
  editButton = false;

  constructor(
    public userStore: UserStoreService,
    private router: Router,
  ) { }

  ngOnInit() {
    console.log("initializing list");
    // this.journeys = this.userStore.journeys.pipe(map(entry => Object.values(entry).reverse()));
    this.userStore.loadData();
  }

  displayJourneyDrawer() {
    this.displayDrawer = true;
  }

  onEditButtonPressed(selectedJourney: Journey) {
    this.displayDrawer = true;
    this.editButton = true;
    this.currJourney = selectedJourney;
  }

  onNewDataLogged(journeyData: { [key: string]: any }) {
    this.userStore.addNewJourney(journeyData);
    this.displayDrawer = false;
  }

  loadJourney(id: number) {
    // Used when a click is detected on rect-item
    // to discern whether the edit button was pressed
    if (!this.editButton) {
      this.router.navigate(["/journeys", id]);
    } else {
      console.log("edit button was pressed");
      this.editButton = false;
    }
  }
}
