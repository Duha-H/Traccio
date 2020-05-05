import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Journey } from 'src/app/models/journey';

@Component({
  selector: 'app-rect-item',
  templateUrl: './rect-item.component.html',
  styleUrls: ['./rect-item.component.css']
})
export class RectItemComponent implements OnChanges {

  @Input() type = 'item'; // type can either be 'add' or 'item'
  @Input() width = 280;
  @Input() height = 400;
  private _linkedJourney: Journey = new Journey();
  // @Input() linkedJourney: Journey = null;

  displayName = 'Title';
  displayDate = 'Date Started: ';
  displayStatus = 'Status: ';

  constructor() { }

  @Input()
  set linkedJourney(journey: Journey) { this._linkedJourney = journey; }
  get linkedJourney() { return this._linkedJourney; }

  ngOnChanges() {
    if (this.linkedJourney) {
      this.displayName = this._linkedJourney.title;
      this.displayDate += `${this._linkedJourney.startDate[0]}/${this._linkedJourney.startDate[1]}/${this._linkedJourney.startDate[2]}`;
      this.displayStatus += this.linkedJourney.active ? 'Active' : 'Inactive';
    }
  }

  addJourney() {
    console.log("adding!");
  }

}
