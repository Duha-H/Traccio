import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { TimelineTooltipPropType } from '../types';

@Component({
  selector: 'timeline-tooltip',
  template: '\
  <div style="background: white; display: flex; flex-direction: row;\
    border-radius: 3px; padding: 8px; box-shadow: var(--shadow-tooltip);" #container>\
    <div style="width: 16px; height: 16px; background: {{props.color}}; line-height: 16px;"></div>\
    <p style="font-size: 10pt; line-height: 16px; color: black; padding-left: 8px; margin: 0;">{{props.text}}</p>\
  </div>\
  ',
  styleUrls: []
})
export class TimelineTooltipComponent implements OnInit, AfterViewInit {

  @Input() props: TimelineTooltipPropType;
  @Output() tooltipAdjustment: EventEmitter<number> = new EventEmitter();
  @ViewChild('container', { static: true }) container: ElementRef;

  ngOnInit() {
    if (!this.props) {
      // throw new TypeError('TimelineTooltipComponent: no tooltip props specified.');
    }
  }

  ngAfterViewInit() {
    const rect = this.container.nativeElement.getBoundingClientRect();
    const left = rect.left;
    const width = rect.right - rect.left;
    if (window.innerWidth - rect.left < width + 20) { // if tooltip is extending beyond window width
      this.tooltipAdjustment.emit(rect.left - width);
    }
  }

}
