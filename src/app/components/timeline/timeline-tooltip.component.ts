import { Component, OnInit, Input } from '@angular/core';
import { TimelineTooltipPropType } from '../types';

@Component({
  selector: 'timeline-tooltip',
  template: '\
  <div style="background: white; display: flex; flex-direction: row;\
    border-radius: 3px; padding: 8px; box-shadow: var(--shadow-tooltip);">\
    <div style="width: 16px; height: 16px; background: {{props.color}}; line-height: 16px;"></div>\
    <p style="font-size: 10pt; line-height: 16px; color: black; padding-left: 8px; margin: 0;">{{props.text}}</p>\
  </div>\
  ',
  styleUrls: []
})
export class TimelineTooltipComponent implements OnInit {

  @Input() props: TimelineTooltipPropType;

  ngOnInit() {
    if (!this.props) {
      // throw new TypeError('TimelineTooltipComponent: no tooltip props specified.');
    }

  }

}
