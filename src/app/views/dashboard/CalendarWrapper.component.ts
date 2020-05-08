import * as React from "react";
import * as ReactDOM from "react-dom";
import * as uuid from "uuid";
import * as invariant from "invariant";

import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  AfterViewInit,
} from "@angular/core";
import { ResponsiveCalendar, ResponsiveCalendarCanvas } from "@nivo/calendar";

interface CalendarProps {
  data: any;
  from: string;
  to: string;
  emptyColor: string;
  colors: any;
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
export class CalendarWrapperComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  // source: https://sdk.gooddata.com/gooddata-ui/docs/4.1.1/ht_use_react_component_in_angular_2.x.html

  @Input() data: any;
  @Input() from: string;
  @Input() to: string;
  @Input() emptyColor: string;
  @Input() colors: any;
  @Input() margin: any;
  @Input() yearSpacing: any;
  @Input() monthBorderColor: string;
  @Input() dayBorderWidth: any;
  @Input() dayBorderColor: string;
  @Input() legends: any;

  public rootDomID: string;

  protected getRootDomNode() {
    const node = document.getElementById(this.rootDomID);
    invariant(node, `Node '${this.rootDomID} not found!`);
    return node;
  }

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

  ngOnInit() {
    this.rootDomID = uuid.v1();
  }

  ngOnChanges() {
    this.render();
  }

  ngAfterViewInit() {
    this.render();
  }

  ngOnDestroy() {
    // Uncomment if Angular 4 issue that ngOnDestroy is called AFTER DOM node removal is resolved
    // ReactDOM.unmountComponentAtNode(this.getRootDomNode())
  }
}

