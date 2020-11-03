import { createElement } from "react";
import { render } from "react-dom";

import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { ReactWrapper } from "./react-wrapper.component";
import { ResponsivePieCanvas, PieCanvasProps, AccessorFunc, PieDatum } from "@nivo/pie";

@Component({
  selector: "pie-chart-wrapper",
  template: '<span [id]="rootDomID"></span>',
})
export class ResponsivePieComponent extends ReactWrapper {
  @Input() data: {
    id: string | number;
    value: number;
    [key: string]: string | number;
  }[];
  @Input() width = 300;
  @Input() height = 300;
  @Input() margin: {};
  @Input() pixelRatio: number;
  @Input() innerRadius: number;
  @Input() padAngle: number;
  @Input() cornerRadius: number;
  @Input() colors: string[];
  @Input() borderColor: string | { theme: string };
  @Input() enableRadialLabels: boolean;
  @Input() radialLabelsSkipAngle: number;
  @Input() radialLabelsTextXOffset: number;
  @Input() radialLabelsTextColor: string | { theme: string };
  @Input() radialLabelsLinkOffset: number;
  @Input() radialLabelsLinkDiagonalLength: number;
  @Input() radialLabelsLinkHorizontalLength: number;
  @Input() radialLabelsLinkStrokeWidth: number;
  @Input() radialLabelsLinkColor: string | { theme: string };
  @Input() slicesLabelsSkipAngle: number;
  @Input() slicesLabelsTextColor: string | { theme: string };
  @Input() sliceLabel: string | AccessorFunc;
  @Input() animate: boolean;
  @Input() motionStiffness: number;
  @Input() motionDamping: number;
  @Input() defs: object[];
  @Input() fill: object[];
  @Input() legends: any;
  @Output() sliceClick = new EventEmitter();
  @Input() onClick: (datum: PieDatum, event: any) => void;

  protected getProps(): PieCanvasProps {
    const {
      data,
      margin,
      pixelRatio,
      innerRadius,
      padAngle,
      cornerRadius,
      colors,
      borderColor,
      enableRadialLabels,
      radialLabelsSkipAngle,
      radialLabelsTextXOffset,
      radialLabelsTextColor,
      radialLabelsLinkOffset,
      radialLabelsLinkDiagonalLength,
      radialLabelsLinkHorizontalLength,
      radialLabelsLinkStrokeWidth,
      radialLabelsLinkColor,
      slicesLabelsSkipAngle,
      slicesLabelsTextColor,
      sliceLabel,
      animate,
      motionStiffness,
      motionDamping,
      legends,
      onClick,
    } = this;
    return {
      data,
      margin,
      pixelRatio,
      innerRadius,
      padAngle,
      cornerRadius,
      colors,
      borderColor,
      enableRadialLabels,
      radialLabelsSkipAngle,
      radialLabelsTextXOffset,
      radialLabelsTextColor,
      radialLabelsLinkOffset,
      radialLabelsLinkDiagonalLength,
      radialLabelsLinkHorizontalLength,
      radialLabelsLinkStrokeWidth,
      radialLabelsLinkColor,
      slicesLabelsSkipAngle,
      slicesLabelsTextColor,
      sliceLabel,
      animate,
      motionStiffness,
      motionDamping,
      legends,
      onClick,
    };
  }

  private isMounted(): boolean {
    return !!this.rootDomID;
  }

  protected render() {
    if (this.isMounted()) {
      render(
        createElement(ResponsivePieCanvas, this.getProps()),
        this.getRootDomNode()
      );
    }
  }
}
