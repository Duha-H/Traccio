import { Component, OnInit } from "@angular/core";
import { ResizeService } from 'src/app/controllers/resize.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-wrapper',
  templateUrl: './landing-wrapper.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingWrapperComponent implements OnInit {

  constructor(public resizeService: ResizeService, public router: Router) { }

  ngOnInit() { }
}
