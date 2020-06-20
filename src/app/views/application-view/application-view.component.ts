import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BreadcrumbsData } from 'src/app/components/types';
import { Application } from 'src/app/models/application';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStoreService } from 'src/app/models/user-store.service';
import { TimelineComponent } from 'src/app/components/timeline/timeline.component';

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
    }
  }

}
