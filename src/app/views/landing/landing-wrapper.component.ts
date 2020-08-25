import { Component, OnInit } from "@angular/core";
import { ResizeService } from 'src/app/controllers/resize.service';

@Component({
  selector: 'app-landing-wrapper',
  templateUrl: './landing-wrapper.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingWrapperComponent implements OnInit {

  constructor(public resizeService: ResizeService) { }

  ngOnInit() { }
}
