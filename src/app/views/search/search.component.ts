import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Journey } from 'src/app/models/journey';
import { Application } from 'src/app/models/application';
import { UserStoreService } from 'src/app/models/user-store.service';
import { SearchPipe } from './search-pipe.pipe';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { KeysPipe } from './keys-pipe.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

  @Input() query = '';
  @Input() parentSearchSubject: BehaviorSubject<string>;
  @Output() clearEvent = new EventEmitter();
  journeys: Journey[] = [];
  applicationMap: {[journeyid: string]: Application[]} = {};
  wishlistApps: Application[] = [];
  filteredJourneys: Journey[] = [];
  filteredAppsMap: {[journeyid: string]: Application[]} = {};
  filteredWishlistApps: Application[] = [];
  journeySub: Subscription = new Subscription();
  wishlistSub: Subscription = new Subscription();

  constructor(
    private userStore: UserStoreService,
    private searchPipe: SearchPipe,
    private router: Router,
    public keys: KeysPipe,
  ) { }

  ngOnInit() {
    this.journeySub = this.userStore.journeys.subscribe(journeys => {
      this.journeys = journeys;
      journeys.forEach(journey => {
        this.applicationMap[journey.id] = journey.applications;
      });
    });
    this.wishlistSub = this.userStore.wishlistApps.subscribe(apps => {
      this.wishlistApps = apps;
    });
    this.parentSearchSubject.subscribe(query => {
      this.search(query);
    });
  }

  ngOnDestroy() {
    this.journeySub.unsubscribe();
    this.wishlistSub.unsubscribe();
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
    this.filteredWishlistApps = this.searchPipe.transform(this.wishlistApps, 'application', queryInput) as Application[];
  }

  clear() {
    this.clearEvent.emit();
  }

  viewResult(type: string, item: Journey | Application, journeyid?: string) {
    if (type === 'journey') {
      this.router.navigate(['/journeys', item.id]);
    } else if (type === 'application' && journeyid) {
      this.router.navigate(['/journeys', journeyid, item.id]);
    } else if (type === 'wishlist') {
      this.router.navigate(['/wishlist', item.id]);
    }
    this.clear();
  }

}
