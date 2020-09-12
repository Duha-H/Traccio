import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, QueryList, AfterViewInit } from '@angular/core';

const SCROLL_RATE = 200;

@Component({
  selector: 'slider-container',
  templateUrl: './slider-container.component.html',
  styleUrls: ['./slider-container.component.css']
})
export class SliderContainerComponent implements OnInit, AfterViewInit {

  @Input() contentType: 'rect-item' | string = 'rect-item';
  @Input() content: any[];
  @Input() scrollRate = SCROLL_RATE;
  @Input() idx = 0;
  @Output() sliderInit: EventEmitter<boolean> = new EventEmitter();
  @Output() idxChange: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.sliderInit.emit();
  }

  ngAfterViewInit() {
    if (!this.content) {
      console.log("SliderContainer: content not defined");
    }
    // this.idxChange.emit(0);
  }

  onSwipe(direction: string, event?: any) {
    console.log('swipe?');
    let updatedIdx: number;
    if (direction === 'left') {
      updatedIdx = this.idx + 1;
    } else if (direction === 'right') {
      updatedIdx = this.idx - 1;
    }
    if (updatedIdx >= this.content.length) {
      updatedIdx = this.content.length - 1;
    } else if (updatedIdx < 0) {
      updatedIdx = 0;
    }

    if (updatedIdx !== this.idx) { // if index has been updated
      this.idx = updatedIdx;
      this.idxChange.emit(this.idx);
    }
  }

}
