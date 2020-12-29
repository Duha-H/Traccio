import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from "@angular/core";
import { Title } from '@angular/platform-browser';
import { ResizeService } from 'src/app/controllers/resize.service';
import { RouterManagerService } from "src/app/controllers/router-manager.service";
import { FAQItem, faqs, SECTIONED_FAQS } from '../../shared-components/faqs/faq';
import { SafeHTMLPipe } from '../../utils/safe-html.pipe';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['/src/app/views/landing/about.component.css', './info.component.css', ],
})
export class InfoComponent implements OnInit {

  now = new Date();
  timeOfDay = 'morning';
  displayMobileNav = false;
  faqItems: FAQItem[] = faqs;
  faqSections = SECTIONED_FAQS;
  @ViewChild('sidenav') nav: ElementRef<HTMLDivElement>;

  constructor(
    public rs: ResizeService,
    public safeHTML: SafeHTMLPipe,
    private titleService: Title,
    public routerManager: RouterManagerService,
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

  displayNav() {
    this.displayMobileNav = !this.displayMobileNav;
    if (this.rs.mobileSize$.value && this.displayMobileNav) {
      this.nav.nativeElement.classList.add('expanded');
    } else if (this.rs.mobileSize$.value && !this.displayMobileNav) {
      this.nav.nativeElement.classList.remove('expanded');
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

}

