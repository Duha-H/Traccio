import { createElement } from "react";
import { render } from "react-dom";

import {
  Component,
  Input,
} from "@angular/core";
import { ResponsiveCalendarCanvas, CalendarDirection, CalendarSvgProps } from "@nivo/calendar";
import { ReactWrapper } from './react-wrapper.component';
import { Theme } from '@nivo/core';


@Component({
  selector: "calendar-wrapper",
  template: '<span [id]="rootDomID"></span>',
})
export class ResponsiveCalendarComponent extends ReactWrapper {

  @Input() data: any;
  @Input() from: string;
  @Input() to: string;
  @Input() emptyColor: string;
  @Input() colors: string[];
  @Input() theme: Theme;
  @Input() margin: any;
  @Input() yearSpacing: any;
  @Input() monthBorderColor: string;
  @Input() dayBorderWidth: any;
  @Input() dayBorderColor: string;
  @Input() legends: any;
  @Input() direction: CalendarDirection;
  @Input() minValue: number | 'auto' = 0;
  @Input() maxValue: number | 'auto' = 'auto';


  protected getProps(): CalendarSvgProps {
    const {
      data,
      from,
      to,
      emptyColor,
      colors,
      theme,
      margin,
      yearSpacing,
      monthBorderColor,
      dayBorderWidth,
      dayBorderColor,
      legends,
      direction,
      minValue,
      maxValue,
    } = this;
    return {
      data,
      from,
      to,
      emptyColor,
      colors,
      theme,
      margin,
      yearSpacing,
      monthBorderColor,
      dayBorderWidth,
      dayBorderColor,
      legends,
      direction,
      minValue,
      maxValue
    };
  }

  private isMounted(): boolean {
    return !!this.rootDomID;
  }

  protected render() {
    if (this.isMounted()) {
      render(
        createElement(ResponsiveCalendarCanvas, this.getProps()),
        this.getRootDomNode()
      );
    }
  }

  private _getEarliestDate() {
    return this.data[0].day;
  }

  private _getLatestDate() {
    return this.data[this.data.length - 1].day;
  }
}

