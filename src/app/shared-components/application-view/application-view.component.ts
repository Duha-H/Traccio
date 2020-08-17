import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BreadcrumbsData, TimelinePropType } from 'src/app/shared-components/types';
import { Application } from 'src/app/models/application';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStoreService } from 'src/app/models/user-store.service';
import { TimelineComponent } from 'src/app/shared-components/timeline/timeline.component';
import { STATUS_COLORS, STATUS, APP_SOURCE, APP_ATTRIBS, REQUIRED_APP_ATTRIBS } from 'src/app/models/constants';
import { KeyValue } from '@angular/common';
import { Journey } from 'src/app/models/journey';
import { ResizeService } from 'src/app/controllers/resize.service';
import { PreferencesStoreService } from 'src/app/controllers/preferences-store.service';
import { ConfettiComponent } from 'src/app/shared-components/confetti/confetti.component';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/controllers/notification.service';
import { MESSAGES } from 'src/assets/template-messages';

@Component({
  selector: 'app-application-view',
  templateUrl: './application-view.component.html',
  styleUrls: ['./application-view.component.css']
})
export class ApplicationViewComponent implements OnInit {

  breadcrumbsData: BreadcrumbsData = {
    current: {
      name: '',
      url: ''
    },
    paths: []
  };
  journeyid: string;
  inputApplication: Application;
  currApplicationDetails: Application;
  detailsUpdated = false;
  timelineProps: TimelinePropType;
  STATUS_COLORS = STATUS_COLORS;
  ATTRIBS = APP_ATTRIBS;
  statuses = [
    {value: STATUS.IN_REVIEW.toString(), viewValue: STATUS.IN_REVIEW.toString()},
    {value: STATUS.ASSESSMENT.toString(), viewValue: STATUS.ASSESSMENT.toString()},
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
  wishlistApp = true; // true if application in current view is a wishlist application
  newApp = true; // true if application in current view is being added
  displayAddOverlay = false;
  statusUpdated = false;
  selectedJourney: Journey;

  @ViewChild('timeline', { static: false }) timeline: TimelineComponent;
  @ViewChild('notesTextArea', { static: true }) notesTextArea: ElementRef<any>;
  @ViewChild(ConfettiComponent) confetti: ConfettiComponent;

  constructor(
    private route: ActivatedRoute,
    public userStore: UserStoreService,
    private router: Router,
    public rs: ResizeService,
    public prefStore: PreferencesStoreService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    let appid: string;
    this.route.params.subscribe(params => {
      if (params.id) {
        this.journeyid = params.id;
        this.wishlistApp = false;
      }
      appid = params.appref;
      if (appid === 'new-app') {
        this.newApp = true;
      } else {
        this.newApp = false;
      }
    });
    if (this.wishlistApp) {
      this.inputApplication = appid === 'new-app' ? new Application() : this.userStore.getWishlistApplication(appid);
    } else if (this.newApp) {
      this.inputApplication = new Application();
    } else {
      this.inputApplication = this.userStore.getApplication(this.journeyid, appid);
    }
    this.currApplicationDetails = Object.assign(new Application(), this.inputApplication);
    if (!this.inputApplication || !this.currApplicationDetails) {
      console.log('ApplicationViewComponent: no application retrieved with id:', appid);
      this.router.navigate(['/home/journeys']);
      return;
    } else {
      if (!this.wishlistApp) {
        this.breadcrumbsData.current.name = 'Application';
        this.breadcrumbsData.current.url = `/home/journeys/${this.journeyid}/${appid}`;
        this.breadcrumbsData.paths.push(
          { name: 'Journeys', url: '/home/journeys' },
          {
            name: this.userStore.getJourney(this.journeyid).title,
            url: `/home/journeys/${this.journeyid}`
          }
        );
      } else {
        this.breadcrumbsData.current.name = 'Wishlist Application';
        this.breadcrumbsData.current.url = `/home/wishlist/${appid}`;
        this.breadcrumbsData.paths.push(
          { name: 'Wishlist', url: '/home/wishlist' }
        );
      }
      this.timelineProps = {
        data: this.inputApplication.timeline,
        colorMappings: STATUS_COLORS
      };
      // this.timeline.draw();
    }
    // make textarea responsive to tab key press
    this.notesTextArea.nativeElement.addEventListener('keydown', (event) => this.keyboardHandler(event));
  }

  updateField(attrib: string, value: string) {
    if (this.currApplicationDetails[attrib] !== undefined) { // value can be empty string
      if (attrib === this.ATTRIBS.STATUS) {
        this.currApplicationDetails.status = value; // handles adding the new status to the application's timeline
        this.timeline.draw(); // trigger timeline re-draw
        this.statusUpdated = true;
      } else {
        this.currApplicationDetails[attrib] = value;
      }
    }
    this.detailsUpdated = this._allDetailsValid();
  }

  saveChanges() {
    if (this.wishlistApp && this.newApp) { // new wishlist application
      this.userStore.addNewWishlistApplication(this.currApplicationDetails)
        .then(response => {
          if (response.successful) {
            this.currApplicationDetails = response.payload;
            this.router.navigate(['/home/wishlist', this.currApplicationDetails.id]);
            this.newApp = false; // it shouldn't matter because we're navigating away so the component is getting destroyed
            this.detailsUpdated = false;
          } else {
            this.notificationService.sendNotification(response.message, 'error');
          }
        });
    } else if (this.wishlistApp && !this.newApp) { // existing wishlist application
      this.userStore.updateWishlistApplication(this.currApplicationDetails)
        .then(response => {
          if (!response.successful) {
            this.notificationService.sendNotification(response.message, 'error');
          } else {
            this.detailsUpdated = false;
          }
        });
    } else if (this.newApp && !this.wishlistApp) { // completely new application
      this.userStore.addNewApplication(this.journeyid, this.currApplicationDetails)
        .then(response => {
          if (response.successful) {
            this.currApplicationDetails = response.payload;
            this.router.navigate(['/home/journeys', this.journeyid, response.payload.id]);
          } else {
            this.notificationService.sendNotification(response.message, 'error');
          }
        });
    } else { // existing application
      this.userStore.updateExistingApplication(this.journeyid, this.currApplicationDetails).then(response => {
        if (!response.successful) {
          this.notificationService.sendNotification(response.message, 'error');
        } else {
          this.detailsUpdated = false;
        }
      });
    }

    // if details were successfully updated and app.status was set to 'OFFER'
    // deploy confetti!
    if (this.statusUpdated && this.currApplicationDetails.status === STATUS.OFFER) {
      setTimeout(() => {
        this.confetti.draw();
        this.notificationService.sendNotification(MESSAGES.congratulatory_offer[Math.floor(Math.random() * 4)], 'standard', 10000);
      }, 800);
      this.statusUpdated = false;
    }
  }

  cancelChanges() {
    // navigates away from new-app view
    if (this.wishlistApp) {
      this.router.navigate(['/home/wishlist']);
    } else if (this.newApp) {
      this.router.navigate(['/home/journeys', this.journeyid]);
    }
  }

  displayAddToJourneyOverlay() {
    this.displayAddOverlay = true;
  }

  addApplicationToJourney(journey: Journey) {
    const journeyid = journey.id;
    if (!journeyid) {
      console.log('ApplicationView: trying to add to journey with invalid id:', journeyid);
      return;
    }
    // add appliaction to journey
    this.userStore.addNewApplication(journeyid, this.currApplicationDetails)
      .then(response => {
        if (response.successful) {
          // if successfully added, remove application from wishlist
          this.userStore.removeWishlistApplication(this.currApplicationDetails.id);
          this.router.navigate(['/home/journeys', journeyid, response.payload.id]);
          this.notificationService.sendNotification(`Application successfully added to ${journey.title}!`, 'success', 5000);
        } else {
          this.notificationService.sendNotification(response.message, 'error');
        }
      });
  }

  /**
   * KeyValue pipe ordering by entry
   */
  originalOrder(a: KeyValue<number, string>, b: KeyValue<number, string>): number {
    return 0;
  }

  keyboardHandler(event: KeyboardEvent) {
    if (event.keyCode === 9) { // handles tab click within textarea
      this.notesTextArea.nativeElement.value += '\t';
      event.preventDefault();
    }
  }

  private _allDetailsValid(): boolean {
    for (const key of Object.keys(this.currApplicationDetails)) {
      if (REQUIRED_APP_ATTRIBS[key] && this.currApplicationDetails[key] === '') {
        return false;
      }
    }
    return true;
  }

}
