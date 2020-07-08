import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { Journey } from 'src/app/models/journey';

@Component({
  selector: 'app-rect-item',
  templateUrl: './rect-item.component.html',
  styleUrls: ['./rect-item.component.css']
})
export class RectItemComponent implements OnInit {

  @Input() type = 'item'; // type can either be 'add' or 'item'
  @Input() width = '18em';
  @Input() height = 370;
  @Input() selectionMode = false;
  @Output() deleteButtonPressed = new EventEmitter<object>();
  private _linkedJourney: Journey;
  // @Input() linkedJourney: Journey = null;

  displayName = 'Title';
  displayDate = 'Date Started: ';
  displayStatus = 'Status: ';
  mouseOver = false;

  constructor() { }

  @Input()
  set linkedJourney(journey: Journey) { this._linkedJourney = journey; }
  get linkedJourney() { return this._linkedJourney; }

  ngOnInit() { }

  onDeleteButtonPressed() {
    this.deleteButtonPressed.emit(this.linkedJourney);
  }

  addJourney() {
    console.log("adding!");
  }

}
