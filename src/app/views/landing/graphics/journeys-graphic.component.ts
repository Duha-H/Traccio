import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'graphic-journeys',
  templateUrl: '/src/assets/landing-graphics/Journeys.svg' ,
  styleUrls: ['../landing-cards.css', '../landing.component.css']
})
export class JourneysGraphicComponent implements OnInit {

  @Input() visible = false;

  ngOnInit() {  }
}
