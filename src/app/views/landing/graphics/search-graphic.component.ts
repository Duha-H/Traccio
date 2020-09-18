import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'graphic-search',
  templateUrl: '/src/assets/landing-graphics/Search.svg' ,
  styleUrls: ['../landing-cards.css', '../landing.component.css']
})
export class SearchGraphicComponent implements OnInit {

  @Input() visible = false;

  ngOnInit() {  }
}
