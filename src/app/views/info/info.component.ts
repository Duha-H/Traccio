import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from "@angular/core";
import { ResizeService } from 'src/app/controllers/resize.service';
import { FAQItem, faqs } from './faq';
import { SafeHTMLPipe } from './safe-html.pipe';

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
  @ViewChild('sidenav') nav: ElementRef<HTMLDivElement>;

  constructor(public rs: ResizeService, public safeHTML: SafeHTMLPipe) { }

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
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest', });
    // this.router.navigate(['about'], { fragment: id }); // fragment scrolling is messy
    element.classList.add('pulse');
    setTimeout(() => {
      element.classList.remove('pulse');
    }, 500);
    this.displayNav();
  }

}

