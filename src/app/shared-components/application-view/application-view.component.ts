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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TimelineDatum } from 'src/app/models/types';

@Component({
  selector: 'app-application-view',
  templateUrl: './application-view.component.html',
  styleUrls: ['./application-view.component.css']
})
export class ApplicationViewComponent implements OnInit {

  breadcrumbsData: BreadcrumbsData = {
    current: { name: '', url: '' },
    paths: []
  };
  parentJourney: Journey;
  currApplicationDetails: Application;
  appFormGroup: FormGroup = new FormGroup({
    positionTitle: new FormControl('', [Validators.required]),
    companyName: new FormControl('', [Validators.required]),
    appDate: new FormControl(new Date(), [Validators.required]),
    status: new FormControl(STATUS.IN_REVIEW.toString()),
    source: new FormControl(APP_SOURCE.JOB_BOARD.toString(), [Validators.required]),
    timeline: new FormControl([]),
    notes: new FormControl(''),
  });
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
    {value: APP_SOURCE.COMPANY.toString(), viewValue: APP_SOURCE.COMPANY.toString()},
    {value: APP_SOURCE.REFERRAL.toString(), viewValue: APP_SOURCE.REFERRAL.toString()},
    {value: APP_SOURCE.FAIR.toString(), viewValue: APP_SOURCE.FAIR.toString()},
    {value: APP_SOURCE.OTHER.toString(), viewValue: APP_SOURCE.OTHER.toString()},
  ];
  wishlistApp = true; // true if application in current view is a wishlist application
  newApp = true; // true if application in current view is being added
  displayAddOverlay = false;
  statusUpdated = false;
  dateUpdated = false;
  selectedJourney: Journey;
  displayStatusUpdateOverlay = false;
  statusUpdateDate = new Date();
  statusUpdateValue = STATUS.IN_REVIEW.toString();

  @ViewChild('timeline', { static: false }) timeline: TimelineComponent;
  @ViewChild('notesTextArea', { static: true }) notesTextArea: ElementRef<any>;
  @ViewChild(ConfettiComponent) confetti: ConfettiComponent;

  constructor(
    public route: ActivatedRoute,
    public userStore: UserStoreService,
    public router: Router,
    public rs: ResizeService,
    public prefStore: PreferencesStoreService,
    public notificationService: NotificationService,
  ) { }

  ngOnInit() { }

  updateField(attrib: string, value: string) {
    if (attrib === this.ATTRIBS.STATUS) {
      if (this.newApp) {
        console.log('??? we\'re here for some reason');
        this.statusUpdateDate = this.appFormGroup.controls.appDate.value;
      }
      const currTimeline = this.appFormGroup.get('timeline').value as TimelineDatum[];
      currTimeline.push({ status: value, date: this.statusUpdateDate });
      this.appFormGroup.patchValue({
        [attrib]: value,
        timeline: currTimeline,
      });
      this.statusUpdated = true;
      this.timelineProps = {
        data: this.appFormGroup.get('timeline').value,
        colorMappings: STATUS_COLORS
      };
      this.timeline.draw(); // trigger timeline re-draw
    } else if (attrib === this.ATTRIBS.DATE) {
      this.appFormGroup.patchValue({ appDate: value });
      this.dateUpdated = true;
    } else {
      this.appFormGroup.patchValue({ [attrib]: value });
    }
    this.detailsUpdated = this.appFormGroup.valid;
    this.displayStatusUpdateOverlay = false;
  }

  updateStatus(value: string) {
    this.statusUpdateValue = value;
    this.displayStatusUpdateOverlay = true;
  }

  cancelChanges() {
    // navigates away from new-app view
    if (this.wishlistApp) {
      this.router.navigate(['/home/wishlist']);
    } else if (this.newApp) {
      this.router.navigate(['/home/journeys', this.parentJourney.id]);
    }
  }

  saveChanges() { }

  displayAddToJourneyOverlay() { }

  addApplicationToJourney(journey: Journey) { }

  /**
   * KeyValue pipe ordering by entry
   */
  originalOrder(a: KeyValue<number, string>, b: KeyValue<number, string>): number {
    return 0;
  }

  keyboardHandler(event: KeyboardEvent) {
    if (event.key === '\t') { // handles tab click within textarea
      this.notesTextArea.nativeElement.value += '\t';
      event.preventDefault();
    }
  }

}
