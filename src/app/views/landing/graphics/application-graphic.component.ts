import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'graphic-application',
  templateUrl: '/src/assets/landing-graphics/AppDetails.svg' ,
  styleUrls: ['../landing-cards.css']
})
export class ApplicationGraphicComponent implements OnInit {

  @Input() visible = false;

  ngOnInit() {  }
}
