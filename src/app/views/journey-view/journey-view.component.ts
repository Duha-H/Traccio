import { Component, OnInit } from '@angular/core';
import { Journey } from 'src/app/models/journey';
import { UserStoreService } from 'src/app/models/user-store.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Application } from 'src/app/models/application';

@Component({
  selector: 'app-journey-view',
  templateUrl: './journey-view.component.html',
  styleUrls: ['./journey-view.component.css']
})
export class JourneyViewComponent implements OnInit {

  // journey: Observable<Journey>;
  journey: Journey;
  applications: Application[];
  startDate: string;
  endDate: string;
  iconClass: string;

  constructor(private route: ActivatedRoute, private userStore: UserStoreService) { }

  ngOnInit() {
    console.log("view initialized");
    // this.route.paramMap.pipe(
    //   switchMap((params: ParamMap) => {
    //     this.userStore.getJourney(+params.get('id')).subscribe((value) => { this.journey = value; } );
    //     return this.userStore.getJourney(+params.get('id'));
    //   })
    // );
    let id;
    this.route.params.subscribe(params => {
      id = params["id"];
      return params["id"];
    });
    // const id = this.route.snapshot.paramMap.get('id');
    this.journey = this.userStore.getJourney(+id);
    this.setJourneyDetails();
    this.applications = this.journey.applications;
    console.log('loaded journey', this.journey);
  }

  setJourneyDetails() {
    this.applications = this.journey.applications;
    const stdate = this.journey.startDate;
    this.startDate = `${stdate[0]}/${stdate[1]}/${stdate[2]}`;
    const endate = this.journey.endDate;
    this.endDate = endate.length === 0
      ? 'Present'
      : `${endate[0]}/${endate[1]}/${endate[2]}`;
    this.iconClass = this.journey.active
      ? 'active-icon'
      : 'inactive-icon';
  }

  viewApplication(application: Application) {
    console.log("viewing!", application);
  }

  addApplication() {
    console.log("adding app!");
  }
}
