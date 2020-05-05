import { Component, OnInit } from '@angular/core';
import { UserStoreService } from '../../models/user-store.service';
import { Journey } from 'src/app/models/journey';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-journey-list',
  templateUrl: './journey-list.component.html',
  styleUrls: ['./journey-list.component.css']
})
export class JourneyListComponent implements OnInit {

  displayDrawer = false;
  currTitle = '';
  currDate: number[] = [];
  currStatus = false;
  currJourney: Journey = null;
  id = 0;

  constructor(private userStore: UserStoreService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  displayJourneyDrawer() {
    this.displayDrawer = true;
  }

  onDataLogged(journeyData: { [key: string]: any }) {
    // console.log(journeyData);
    this.userStore.addNewJourney(journeyData);
    this.displayDrawer = false;
  }

  loadJourney(id: number) {
    this.router.navigate(['/journeys', id]);
  }

}
