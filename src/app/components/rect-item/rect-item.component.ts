import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-rect-item',
  templateUrl: './rect-item.component.html',
  styleUrls: ['./rect-item.component.css']
})
export class RectItemComponent implements OnInit, OnChanges {

  @Input() type = 'item'; // type can either be 'add' or 'item'

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log(this.type);
    if (this.type === 'add') {
      const parentDiv = document.getElementById('journey-container');
      console.log(parentDiv);
      parentDiv.className = 'container add';
    }
  }

  addJourney() {
    console.log("adding!");
  }

}
