import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-rect-item',
  templateUrl: './rect-item.component.html',
  styleUrls: ['./rect-item.component.css']
})
export class RectItemComponent implements OnInit {

  @Input() type = 'item'; // type can either be 'add' or 'item'
  @Input() width = 280;
  @Input() height = 400;

  constructor() { }

  ngOnInit() {

  }

  addJourney() {
    console.log("adding!");
  }

}
