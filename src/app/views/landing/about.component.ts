import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { ResizeService } from 'src/app/controllers/resize.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css', './landing.component.css'],
})
export class AboutComponent implements OnInit {

  now = new Date();
  timeOfDay = 'morning';
  displayMobileNav = false;
  @ViewChild('mobileNav') mobileNav: ElementRef;
  @ViewChild('sidenav') nav: ElementRef<HTMLDivElement>;

  constructor(public resizeService: ResizeService, private router: Router) { }

  ngOnInit() {
    const hour = this.now.getHours();
    if (hour < 12) {
      this.timeOfDay = 'morning';
    } else if (hour >= 12 && hour < 5) {
      this.timeOfDay = 'afternoon';
    } else {
      this.timeOfDay = 'evening';
    }
  }

  scroll(id: string) {
    const element = document.querySelector(`#${id}`);
    element.scrollIntoView(false);
    element.classList.add('pulse');
    setTimeout(() => {
      element.classList.remove('pulse');
    }, 500);
    this.displayNav();
  }

  displayNav() {
    this.displayMobileNav = !this.displayMobileNav;
    console.log('nav click', this.displayMobileNav, this.resizeService.mobileSize$.value, this.nav);
    if (this.resizeService.mobileSize$.value && this.displayMobileNav) {
      this.nav.nativeElement.classList.add('expanded');
    } else if (this.resizeService.mobileSize$.value && !this.displayMobileNav) {
      this.nav.nativeElement.classList.remove('expanded');
    }
  }

  onWrapperClick(event: Event) {
    // If a click is registered outside of the nav toggle button
    // hide mobileNav
    if (this.displayMobileNav && !this.mobileNav.nativeElement.contains(event.target)) {
      this.displayMobileNav = false;
    }
  }
}
