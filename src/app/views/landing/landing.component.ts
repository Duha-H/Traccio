import { Component, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { ResizeService } from 'src/app/controllers/resize.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    "(window:scroll)": "checkView()",
  },
})
export class LandingComponent implements OnInit, AfterViewInit {

  @ViewChildren('card') cards: QueryList<ElementRef>;
  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    console.log('checking?');
    for (const card of this.cards) {
      // const card = this.cards[i];
      const cardPos = card.nativeElement.getBoundingClientRect().top;
      if (cardPos - window.innerHeight <= 0) {
        card.nativeElement.classList.add('card-visible');
        console.log('card visible:', card);
      }
    }
  }

  constructor(public resizeService: ResizeService) { }

  ngOnInit() {
    window.addEventListener('scroll', () => {
      this.checkView();
      console.log('scroll?');
    });
    console.log('something???');
  }

  ngAfterViewInit() {
    console.log(this.cards.length);
  }

  checkView() {
    console.log('checking???');
    console.log(this.cards.length);
    for (const card of this.cards) {
      // const card = this.cards[i];
      const cardPos = card.nativeElement.getBoundingClientRect().top;
      if (cardPos - window.innerHeight <= 0) {
        card.nativeElement.classList.add('card-visible');
        console.log('card visible:', card);
      }
    }
  }
}
