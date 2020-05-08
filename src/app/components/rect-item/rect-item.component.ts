import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { Journey } from 'src/app/models/journey';

@Component({
  selector: 'app-rect-item',
  templateUrl: './rect-item.component.html',
  styleUrls: ['./rect-item.component.css']
})
export class RectItemComponent implements OnChanges {

  @Input() type = 'item'; // type can either be 'add' or 'item'
  @Input() width = 250;
  @Input() height = 370;
  @Output() editButtonPressed = new EventEmitter<object>();
  private _linkedJourney: Journey;
  // @Input() linkedJourney: Journey = null;

  displayName = 'Title';
  displayDate = 'Date Started: ';
  displayStatus = 'Status: ';

  constructor() { }

  @Input()
  set linkedJourney(journey: Journey) { this._linkedJourney = journey; }
  get linkedJourney() { return this._linkedJourney; }

  ngOnChanges() {
    if (this._linkedJourney) {
      console.log("UPdatED");
      this.displayName = this._linkedJourney.title;
      this.displayDate += `${this._linkedJourney.startDate[0]}/${this._linkedJourney.startDate[1]}/${this._linkedJourney.startDate[2]}`;
      this.displayStatus += this.linkedJourney.active ? 'Active' : 'Inactive';
    }
  }

  onEditButtonPressed() {
    console.log("edit");
    this.editButtonPressed.emit(this.linkedJourney);
  }

  addJourney() {
    console.log("adding!");
  }

}
