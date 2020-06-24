import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

const SCROLL_RATE = 80;

@Component({
  selector: 'overflow-wrapper',
  templateUrl: './overflow-wrapper.component.html',
  styleUrls: ['./overflow-wrapper.component.css']
})
export class OverflowWrapperComponent implements OnInit {

  currHorizontalScroll = 0;
  maxHorizontalScroll = 0;
  displayLeft = false;
  displayRight = true;
  @Input() scrollRate = SCROLL_RATE;

  @ViewChild('overflowContent', {static: true}) content: ElementRef<HTMLElement>;

  constructor() { }

  ngOnInit() {
    this.maxHorizontalScroll = this.content.nativeElement.scrollWidth - this.content.nativeElement.clientWidth;
    console.log(this.content.nativeElement.scrollWidth);

  }

  scroll(direction: 'left' | 'right') {
    // const value = this.currHorizontalScroll >= this.maxHorizontalScroll ? 0 : this.scrollRate;
    const value = this.scrollRate;
    if (direction === 'left') {
      this.currHorizontalScroll -= value;
    } else {
      this.currHorizontalScroll += value;
    }
    this.content.nativeElement.scroll({
      left: this.currHorizontalScroll,
      behavior: 'smooth'
    });
    // this.content.nativeElement.scrollLeft += this.currHorizontalScroll;
    console.log(this.content.nativeElement.scrollWidth);
    console.log(this.content.nativeElement.scrollLeft, this.currHorizontalScroll);
  }

}
