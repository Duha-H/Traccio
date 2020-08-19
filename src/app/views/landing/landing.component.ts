import { Component, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { ResizeService } from 'src/app/controllers/resize.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    "(window:scroll)": "checkView($event)",
  },
})
export class LandingComponent implements OnInit {

  @ViewChildren('card') cards: QueryList<ElementRef>;
  @HostListener('scroll', ['$event'])
  onScroll(event: Event) {
    this.checkView();
  }

  constructor(public resizeService: ResizeService) { }

  ngOnInit() {
    // scroll to top
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  checkView(event?: any) {
    for (const card of this.cards) {
      const cardTop = card.nativeElement.getBoundingClientRect().top;
      const cardBottom  = card.nativeElement.getBoundingClientRect().bottom;
      if (cardTop - window.innerHeight <= 0) {
        card.nativeElement.classList.add('card-visible');
      } else {
        card.nativeElement.className = 'card-parent';
      }
    }
  }
}
