import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Journey } from 'src/app/models/journey';
import { Application } from 'src/app/models/application';
import { UserStoreService } from 'src/app/models/user-store.service';
import { SearchPipe } from './search-pipe.pipe';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Input() query = '';
  @Input() parentSearchSubject: BehaviorSubject<string>;
  @Output() clearEvent = new EventEmitter();
  journeys: Journey[] = [];
  applicationMap: {[journeyid: string]: Application[]} = {};
  filteredJourneys: Journey[] = [];
  filteredAppsMap: {[journeyid: string]: Application[]} = {};

  constructor(
    private userStore: UserStoreService,
    private searchPipe: SearchPipe,
    private router: Router
  ) { }

  ngOnInit() {
    this.userStore.journeys.subscribe(journeys => {
      this.journeys = journeys;
      journeys.forEach(journey => {
        this.applicationMap[journey.id] = journey.applications;
      });
    });
    this.parentSearchSubject.subscribe(query => {
      this.search(query);
    });
  }

  search(queryInput: string) {
    this.query = queryInput;
    this.filteredJourneys = this.searchPipe.transform(this.journeys, 'journey', queryInput) as Journey[];
    this.filteredAppsMap = {};
    for (const journeyid of Object.keys(this.applicationMap)) {
      const apps = this.searchPipe.transform(this.applicationMap[journeyid], 'application', queryInput) as Application[];
      if (apps.length > 0) {
        this.filteredAppsMap[journeyid] = apps;
      }
    }
  }

  clear() {
    this.clearEvent.emit();
  }

  viewResult(type: string, item: Journey | Application, journeyid: string) {
    if (type === 'journey') {
      this.router.navigate(['/journeys', journeyid]);
    } else if (type === 'application') {
      this.router.navigate(['/journeys', journeyid, item.id]);
    }
    this.clear();
  }

}
