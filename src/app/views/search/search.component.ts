import { Component, OnInit } from '@angular/core';
import { Journey } from 'src/app/models/journey';
import { Application } from 'src/app/models/application';
import { UserStoreService } from 'src/app/models/user-store.service';
import { SearchPipe } from './search-pipe.pipe';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  query = '';
  journeys: Journey[] = [];
  applicationMap: {[journeyid: string]: Application[]} = {};
  applications: Application[] = [];
  filteredJourneys: Journey[] = [];
  filteredApps: Application[] = [];

  constructor(private userStore: UserStoreService, private searchPipe: SearchPipe) { }

  ngOnInit() {
    this.userStore.journeys.subscribe(journeys => {
      this.journeys = journeys;
      journeys.forEach(journey => {
        this.applicationMap[journey.id] = journey.applications;
      });
    });
    this.applications = this.flattenedApps();
  }

  flattenedApps(): Application[] {
    const result: Application[] = [];
    Object.values(this.applicationMap).forEach(array => {
      result.push(...array);
    });
    return result;
  }

  search(queryInput: string) {
    this.query = queryInput;
    this.filteredJourneys = this.searchPipe.transform(this.journeys, 'journey', queryInput) as Journey[];
    this.filteredApps = this.searchPipe.transform(this.applications, 'application', queryInput) as Application[];
  }

}
