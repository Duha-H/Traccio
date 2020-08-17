import { Component, OnInit } from '@angular/core';
import { ResizeService } from 'src/app/controllers/resize.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {

  constructor(public resizeService: ResizeService) { }

  ngOnInit() { }
}
