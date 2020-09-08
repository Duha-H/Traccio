import { Component, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { ResizeService } from 'src/app/controllers/resize.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css', './landing-cards.css'],
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    "(window:scroll)": "checkView($event)",
  },
})
export class LandingComponent implements OnInit {

  constructor(public resizeService: ResizeService) { }

  @ViewChildren('card') cards: QueryList<ElementRef>;
  // graphicVisible = false;
  cardVisible = {
    0: true,
    1: true,
    2: true,
  };
  // @HostListener('scroll', ['$event'])
  // onScroll(event: Event) {
  //   this.checkView();
  // }


  ngOnInit() {
    // scroll to top
    // document.body.scrollTop = 0;
    // document.documentElement.scrollTop = 0;
  }

  checkView(event?: any) {
    // for (let i = 0; i < this.cards.length; i++) {
    let i = 0;
    for (const card of this.cards) {
      // const card = this.cards[i];
      const cardTop = card.nativeElement.getBoundingClientRect().top;
      const cardBottom  = card.nativeElement.getBoundingClientRect().bottom;
      if (cardTop - window.innerHeight <= 0) {
        card.nativeElement.classList.add('card-visible');
        this.cardVisible[i] = true;
      } else {
        card.nativeElement.className = 'card-parent';
        this.cardVisible[i] = false;
      }
      i++;
    }
  }
}
