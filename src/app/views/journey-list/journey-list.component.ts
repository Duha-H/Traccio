import { Component, OnInit, OnChanges } from "@angular/core";
import { UserStoreService } from "src/app/models/user-store.service";
import { Journey } from "src/app/models/journey";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { map, pluck, flatMap, mergeMap } from 'rxjs/operators';
import { ResizeService } from 'src/app/controllers/resize.service';

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
  deleteButton = false;
  selectionMode = false;

  constructor(
    public userStore: UserStoreService,
    private router: Router,
    public rs: ResizeService,
  ) { }

  ngOnInit() {
    this.userStore.loadData();
  }

  displayJourneyDrawer() {
    this.displayDrawer = true;
  }

  activateSelectionMode() {
    this.selectionMode = !this.selectionMode;
  }

  onDeleteButtonPressed(selectedJourney: Journey) {
    this.deleteButton = true;
  }

  removeJourney(selectedJourney: Journey) {
    if (confirm(`Are you sure you'd like to remove ${selectedJourney.title}?`)) {
      this.userStore.removeJourney(selectedJourney.id);
      this.deleteButton = false;
    }
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
