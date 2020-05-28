import * as React from "react";
import * as ReactDOM from "react-dom";

import {
  Component,
  Input,
} from "@angular/core";
import { ResponsiveCalendarCanvas } from "@nivo/calendar";
import { ReactWrapper } from './react-wrapper.component';

interface CalendarProps {
  data: any;
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
    };
  }

  private isMounted(): boolean {
    return !!this.rootDomID;
  }

  protected render() {
    if (this.isMounted()) {
      ReactDOM.render(
        React.createElement(ResponsiveCalendarCanvas, this.getProps()),
        this.getRootDomNode()
      );
    }
  }
}

