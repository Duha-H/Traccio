import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { ResizeService } from 'src/app/controllers/resize.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./landing-views.css'],
})
export class AboutComponent implements OnInit {

  now = new Date();
  timeOfDay = 'morning';
  displayNav = false;
  @ViewChild('mobileNav') mobileNav: ElementRef;
  @ViewChild('sidenav') nav: ElementRef<HTMLDivElement>;

  constructor(
    public rs: ResizeService,
    private router: Router,
    private titleService: Title,
  ) { }

  ngOnInit() {
    this.titleService.setTitle('About | Traccio');
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
    this.toggleNav();
  }

  toggleNav() {
    this.displayNav = !this.displayNav;
    console.log('nav click', this.displayNav, this.rs.mobileSize$.value, this.nav);
    if (this.rs.mobileSize$.value && this.displayNav) {
      this.nav.nativeElement.classList.add('expanded');
    } else if (this.rs.mobileSize$.value && !this.displayNav) {
      this.nav.nativeElement.classList.remove('expanded');
    }
  }

  onWrapperClick(event: Event) {
    // If a click is registered outside of the nav toggle button
    // hide mobileNav
    if (this.displayNav && !this.mobileNav.nativeElement.contains(event.target)) {
      this.displayNav = false;
    }
  }
}
