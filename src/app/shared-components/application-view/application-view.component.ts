import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BreadcrumbsData, TimelinePropType } from 'src/app/shared-components/types';
import { Application } from 'src/app/models/application';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStoreService } from 'src/app/models/user-store.service';
import { TimelineComponent } from 'src/app/shared-components/timeline/timeline.component';
import { STATUS_COLORS, STATUS, APP_SOURCE, APP_ATTRIBS } from 'src/app/models/constants';
import { KeyValue } from '@angular/common';
import { Journey } from 'src/app/models/journey';
import { ResizeService } from 'src/app/controllers/resize.service';
import { PreferencesStoreService } from 'src/app/controllers/preferences-store.service';
import { ConfettiComponent } from 'src/app/shared-components/confetti/confetti.component';
import { NotificationService } from 'src/app/controllers/notification.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TimelineDatum } from 'src/app/models/types';
import { Title } from '@angular/platform-browser';
import { RouterManagerService } from 'src/app/controllers/router-manager.service';

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
    source: new FormControl(APP_SOURCE.SOCIAL.toString(), [Validators.required]),
    timeline: new FormControl([]),
    notes: new FormControl(''),
  });
  detailsUpdated = false;
  timelineProps: TimelinePropType;
  STATUS_COLORS = STATUS_COLORS;
  ATTRIBS = APP_ATTRIBS;
  statuses = Object.values(STATUS).map(status => {
    return {value: status, viewValue: status};
  });
  sources = Object.values(APP_SOURCE).map(source => {
    return {value: source, viewValue: source};
  });
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
    public routerManager: RouterManagerService,
    public userStore: UserStoreService,
    public router: Router,
    public rs: ResizeService,
    public prefStore: PreferencesStoreService,
    public notificationService: NotificationService,
    public titleService: Title,
  ) { }

  ngOnInit() { }

  updateField(attrib: string, value: string) {
    if (attrib === this.ATTRIBS.STATUS) { // handle status update
      if (this.newApp) {
        this.statusUpdateDate = this.appFormGroup.controls.appDate.value;
      }
      const currTimeline: TimelineDatum[] = [];
      currTimeline.push(
        ...this.appFormGroup.get('timeline').value,
        { status: value, date: this.statusUpdateDate },
      );
      this.appFormGroup.patchValue({ // update form group
        status: value,
        timeline: currTimeline,
      });
      this.timeline.updateProps({ // update timeline props
        data: this.appFormGroup.get('timeline').value,
        colorMappings: STATUS_COLORS
      });
      this.statusUpdated = true;
    } else if (attrib === this.ATTRIBS.DATE) { // handle date update
      const currTimeline: TimelineDatum[] = [];
      currTimeline.push(
        ...this.appFormGroup.get('timeline').value,
      );
      if (currTimeline && this.timeline) {
        currTimeline.map(entry => {
          if (entry.status === STATUS.IN_REVIEW) {
            entry.date = new Date(value);
          }
        });
        this.appFormGroup.patchValue({
          appDate: value,
          timeline: currTimeline,
        });
        this.timeline.updateProps({
          data: this.appFormGroup.get('timeline').value,
          colorMappings: STATUS_COLORS
        });
      } else {
        this.appFormGroup.patchValue({ appDate: value, });
      }
      this.dateUpdated = true;
    } else { // handle all other updates
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
      this.router.navigate([ this.routerManager.getParentRoute()]);
    } else if (this.newApp) {
      this.router.navigate([ this.routerManager.getParentRoute()]);
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
