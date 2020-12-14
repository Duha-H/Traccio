import { Component, OnInit } from "@angular/core";
import { ResizeService } from 'src/app/controllers/resize.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoaderService } from "src/app/controllers/loader.service";

@Component({
  selector: 'app-landing-wrapper',
  templateUrl: './landing-wrapper.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingWrapperComponent implements OnInit {

  navOverlay = false;

  constructor(
    public resizeService: ResizeService,
    public router: Router,
    private titleService: Title,
    public loaderService: LoaderService,
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Traccio');
  }

  navigateAway(route: string) {
    this.navOverlay = false;
    this.router.navigate([route]);
  }
}
