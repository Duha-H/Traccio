import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { Journey } from 'src/app/models/journey';
import { ResizeService } from 'src/app/controllers/resize.service';

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
  private _linkedJourney: Journey = new Journey();
  // @Input() linkedJourney: Journey = null;

  displayName = 'Title';
  displayDate = 'Date Started: ';
  displayStatus = 'Status: ';
  mouseOver = false;

  constructor(private rs: ResizeService) { }

  @Input()
  set linkedJourney(journey: Journey) { this._linkedJourney = journey; }
  get linkedJourney() { return this._linkedJourney; }

  ngOnInit() {
    this.width = this.rs.mobileSize$.value ? '11em' : '18em';
    this.height = this.rs.mobileSize$.value ? 260 : 370;
  }

  onDeleteButtonPressed() {
    this.deleteButtonPressed.emit(this.linkedJourney);
  }

}
