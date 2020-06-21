import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BreadcrumbsData, TimelinePropType } from 'src/app/components/types';
import { Application } from 'src/app/models/application';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStoreService } from 'src/app/models/user-store.service';
import { TimelineComponent } from 'src/app/components/timeline/timeline.component';
import { STATUS_COLORS, STATUS, APP_SOURCE } from 'src/app/models/constants';
import { KeyValue } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

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
    paths: [
      { name: 'Journeys', url: '/journeys' },
    ]
  };
  application: Application;
  timelineProps: TimelinePropType;
  STATUS_COLORS = STATUS_COLORS;
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

  @ViewChild('timeline', { static: true }) timeline: ElementRef<any>;

  constructor(
    private route: ActivatedRoute,
    private userStore: UserStoreService,
    private router: Router
  ) { }

  ngOnInit() {
    let journeyid: string;
    let appid: string;
    this.route.params.subscribe(params => {
      journeyid = params.id;
      appid = params.appref;
    });
    this.application = this.userStore.getApplication(journeyid, +appid); // TODO: sort out application id thing
    if (!this.application) {
      console.log('ApplicationViewComponent: no application retrieved with id:', appid);
      this.router.navigate(['/journeys']);
      return;
    } else {
      this.breadcrumbsData.current.name = 'Application';
      this.breadcrumbsData.current.url = `/journeys/${journeyid}/${appid}`;
      this.breadcrumbsData.paths.push({
        name: this.userStore.getJourney(journeyid).title,
        url: `/journeys/${journeyid}`
      });
      this.timelineProps = {
        data: this.application.timeline,
        colorMappings: STATUS_COLORS
      };
    }
  }

  updateDate(event: MatDatepickerInputEvent<Date>) {

  }

  saveChanges() {

  }

  /**
   * KeyValue pipe ordering by entry
   */
  originalOrder(a: KeyValue<number, string>, b: KeyValue<number, string>): number {
    return 0;
  }

}
