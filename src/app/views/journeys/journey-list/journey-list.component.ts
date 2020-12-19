import { Component, OnInit, OnChanges, ViewChild, QueryList, ViewChildren, ElementRef, OnDestroy, Input } from "@angular/core";
import { UserStoreService } from "src/app/models/user-store.service";
import { Journey } from "src/app/models/journey";
import { ActivatedRoute, Router } from "@angular/router";
import { ResizeService } from 'src/app/controllers/resize.service';
import { SliderContainerComponent } from 'src/app/shared-components/slider-container/slider-container.component';
import { NotificationService } from 'src/app/controllers/notification.service';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: "app-journey-list",
  templateUrl: "./journey-list.component.html",
  styleUrls: ["./journey-list.component.css"],
})
export class JourneyListComponent implements OnInit, OnDestroy {

  currJourney: Journey = null;
  journeys: Journey[] = [];
  editButton = false;
  deleteButton = false;
  selectionMode = false;
  sliderIdx = 0;
  swipeOffset = 0;
  routeSub: Subscription;
  journeyList: QueryList<ElementRef>;
  @Input() displayDrawer = false;
  @ViewChild(SliderContainerComponent) sliderContainer: SliderContainerComponent;
  @ViewChildren('journeyItem')
  set journeyItems(items: QueryList<ElementRef>) {
    this.journeyList = items;
    if (this.sliderIdx < this.journeyList.length &&
        !this.selectionMode &&
        this.rs.mobileSize$.value
        ) {
      this.onSwipe();
    }
  }

  constructor(
    public userStore: UserStoreService,
    private router: Router,
    private route: ActivatedRoute,
    public rs: ResizeService,
    private notificationService: NotificationService,
    private titleService: Title,
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Journeys | Traccio');
    this.routeSub = this.route.params.subscribe((params) => {
      if (params.displayDrawer) {
        this.displayDrawer = true;
      }
    });
    const storedSliderIdx = sessionStorage.getItem('journeySliderIdx');
    if (storedSliderIdx) {
      this.sliderIdx = +storedSliderIdx;
    }
    sessionStorage.setItem('journeyRoute', '/home/journeys');
  }

  ngOnDestroy() {
    sessionStorage.setItem('journeySliderIdx', this.sliderIdx.toString()); // persist current sliderIdx
    this.routeSub.unsubscribe();
  }

  displayJourneyDrawer() {
    this.displayDrawer = true;
  }

  activateSelectionMode() {
    this.selectionMode = !this.selectionMode;
  }

  journeyItemClick(idx: number) {
    if (idx === this.sliderIdx) { // do nothing if the journey clicked is the currently "active" one
      return;
    }
    // otherwise trigger a swipe
    this.onSwipe(idx);
  }

  onDeleteButtonPressed(selectedJourney: Journey) {
    this.deleteButton = true;
  }

  removeJourney(selectedJourney: Journey, idx?: number) {
    if (confirm(`Are you sure you'd like to remove ${selectedJourney.title}?`)) {
      const response = this.userStore.removeJourney(selectedJourney.id, this.journeyList.toArray()[idx]);
      response.then(value => {
        if (value.successful) {
          this.notificationService.sendNotification(`${selectedJourney.title} removed successfully!`, 'success');
        } else {
          this.notificationService.sendNotification(value.message, 'error');
        }
      });
      this.deleteButton = false;
      const journeysLength = this.userStore.getJourneys().length;
      if (journeysLength === 0) {
        this.selectionMode = false;
      }
      if (idx === undefined) { // explicit check because idx can be 0
        return;
      }
      if (idx >= journeysLength) {
        this.onSwipe(idx - 1);
      }
    }
  }

  onNewDataLogged(journeyData: { [key: string]: any }) {
    const response = this.userStore.addNewJourney(journeyData);
    response.then(value => {
      if (!value.successful) {
        this.notificationService.sendNotification(value.message, 'error');
      }
    });
    this.displayDrawer = false;
  }

  loadJourney(id: number) {
    // Used when a click is detected on rect-item
    // to discern whether the edit button was pressed
    if (!this.editButton) {
      this.router.navigate(['/home/journeys', id]);
    } else {
      console.log("edit button was pressed");
      this.editButton = false;
    }
  }

  onSwipe(idx?: number) {
    if (idx >= this.journeyList.toArray().length || idx < 0) {
      return;
    }
    // idx is set here for styling
    if (idx !== undefined) { // explicit check because idx could be 0
      this.sliderIdx = idx;
    }
    // scrolling is done here for now to avoid passing undefined elementRefs to SliderContainerComponent
    this.journeyList.toArray()[this.sliderIdx].nativeElement.scrollIntoView({behavior: "smooth", block: "end", inline: "center"});
  }
}
