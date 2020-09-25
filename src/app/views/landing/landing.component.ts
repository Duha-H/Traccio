import { Component, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { ResizeService } from 'src/app/controllers/resize.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css', './landing-cards.css'],
})
export class LandingComponent implements OnInit {

  constructor(public resizeService: ResizeService) { }

  @ViewChildren('card') cards: QueryList<ElementRef>;
  cardVisible = {
    0: true,
    1: false,
    2: false,
    3: false,
  };
  currentCard = 0;
  currentIntervalID = -1;


  ngOnInit() {
    // this.setNewInterval();
  }

  checkView(event?: any) {
    let i = 0;
    for (const card of this.cards) {
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

  selectGraphic(graphicId?: number) {
    if (graphicId === undefined) { // explicit check because value can be 0 or 1
      this.currentCard = this.currentCard + 1 > 3
        ? 0
        : this.currentCard + 1;
    } else {
      this.currentCard = graphicId;
      // this.setNewInterval();
    }
    // select new visible graphic
    this.cardVisible = {
      0: false,
      1: false,
      2: false,
      3: false,
    };
    this.cardVisible[this.currentCard] = true;
  }

  setNewInterval() {
    window.clearInterval(this.currentIntervalID);
    this.currentIntervalID = window.setInterval(() => {
      this.selectGraphic();
    }, CARD_VISIBILITY_INTERVAL);
  }
}

const CARD_VISIBILITY_INTERVAL = 8000; // ms
