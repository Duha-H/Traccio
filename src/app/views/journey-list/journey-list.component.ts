import { Component, OnInit, OnChanges, ViewChild, QueryList, ViewChildren, ElementRef, AfterViewInit } from "@angular/core";
import { UserStoreService } from "src/app/models/user-store.service";
import { Journey } from "src/app/models/journey";
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { ResizeService } from 'src/app/controllers/resize.service';
import { RectItemComponent } from 'src/app/components/rect-item/rect-item.component';
import { SliderContainerComponent } from 'src/app/components/slider-container/slider-container.component';

@Component({
  selector: "app-journey-list",
  templateUrl: "./journey-list.component.html",
  styleUrls: ["./journey-list.component.css"],
})
export class JourneyListComponent implements OnInit, AfterViewInit {

  displayDrawer = false;
  currJourney: Journey = null;
  journeys: Observable<Journey[]>;
  editButton = false;
  deleteButton = false;
  selectionMode = false;
  sliderIdx = 0;
  swipeOffset = 0;
  @ViewChild(SliderContainerComponent) sliderContainer: SliderContainerComponent;
  @ViewChildren('journeyItem', { read: ElementRef }) journeyList!: QueryList<ElementRef>;

  constructor(
    public userStore: UserStoreService,
    private router: Router,
    public rs: ResizeService,
  ) { }

  ngOnInit() {
    this.userStore.loadData();
  }

  ngAfterViewInit() {
    this.onSwipe(0);
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

  onSliderInit() {
    // this.sliderContainer.setContent(this.journeyList);
    // console.log(this.journeyList);
    // if (this.journeyList) {
    //   this.journeyList.toArray()[0].nativeElement.scrollIntoView({behavior: "smooth", block: "end", inline: "center"});
    // }
  }

  onSwipe(idx: number) {
    // idx is set here for styling
    this.sliderIdx = idx;
    // scrolling is done here for now to avoid passing undefined elementRefs to SliderContainerComponent
    this.journeyList.toArray()[this.sliderIdx].nativeElement.scrollIntoView({behavior: "smooth", block: "end", inline: "center"});
  }
}
