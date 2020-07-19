import { createElement } from "react";
import { render } from "react-dom";

import {
  Component,
  Input,
} from "@angular/core";
import { ResponsiveCalendarCanvas, CalendarDirection } from "@nivo/calendar";
import { ReactWrapper } from './react-wrapper.component';

interface CalendarProps {
  data: {day: string, value: number}[];
  from: string | Date;
  to: string | Date;
  emptyColor: string;
  colors: string[];
  margin: any;
  yearSpacing: any;
  monthBorderColor: string;
  dayBorderWidth: any;
  dayBorderColor: string;
  legends: any;
  direction: CalendarDirection;
}

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
  @Input() margin: any;
  @Input() yearSpacing: any;
  @Input() monthBorderColor: string;
  @Input() dayBorderWidth: any;
  @Input() dayBorderColor: string;
  @Input() legends: any;
  @Input() direction: CalendarDirection;


  protected getProps(): CalendarProps {
    const {
      data,
      from,
      to,
      emptyColor,
      colors,
      margin,
      yearSpacing,
      monthBorderColor,
      dayBorderWidth,
      dayBorderColor,
      legends,
      direction,
    } = this;
    return {
      data,
      from,
      to,
      emptyColor,
      colors,
      margin,
      yearSpacing,
      monthBorderColor,
      dayBorderWidth,
      dayBorderColor,
      legends,
      direction,
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

