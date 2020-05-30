import * as React from "react";
import * as ReactDOM from "react-dom";

import { Component, Input } from "@angular/core";
import { ReactWrapper } from "./react-wrapper.component";
import { ResponsivePieCanvas, PieCanvasProps } from "@nivo/pie";

interface PieChartProps {
  data: {
    id: string | number;
    value: number;
    [key: string]: string | number;
  }[];
  width?: number;
  height?: number;
  pixelRatio?: number;
  startAngle?: number;
  endAngle?: number;
  fit?: boolean;
  innerRadius?: number;
  padAngle?: number;
  cornerRadius?: number;
  sortByValue?: boolean;
  margin?: {};
  colors?: string[];
  defs?: object[];
  fill?: object[];
  borderWidth?: number;
  borderColor?: string | object | Function;
  enableRadialLabels?: boolean;
  radialLabel?: string | Function;
  radialLabelsSkipAngle?: number;
  radialLabelsLinkOffset?: number;
  radialLabelsLinkDiagonalLength?: number;
  radialLabelsLinkHorizontalLength?: number;
  radialLabelsTextXOffset?: number;
  radialLabelsLinkStrokeWidth?: number;
  radialLabelsTextColor?: string | object | Function;
  radialLabelsLinkColor?: string | object | Function;
  enableSlicesLabels?: boolean;
  sliceLabel?: string | Function;
  slicesLabelsSkipAngle?: number;
  slicesLabelsTextColor?: string | object | Function;
  isInteractive?: boolean;
  onClick?: Function;
  tooltip?: Function;
  animate?: boolean;
  motionStiffness?: number;
  motionDamping?: number;
  legends: any;
}

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
  @Input() margin: {};
  @Input() pixelRatio: number;
  @Input() innerRadius: number;
  @Input() padAngle: number;
  @Input() cornerRadius: number;
  @Input() colors: string[];
  @Input() borderColor: string | { theme: string };
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
  @Input() animate: boolean;
  @Input() motionStiffness: number;
  @Input() motionDamping: number;
  @Input() defs: object[];
  @Input() fill: object[];
  @Input() legends: any;

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
      animate,
      motionStiffness,
      motionDamping,
      legends,
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
      animate,
      motionStiffness,
      motionDamping,
      legends,
    };
  }

  private isMounted(): boolean {
    return !!this.rootDomID;
  }

  protected render() {
    if (this.isMounted()) {
      ReactDOM.render(
        React.createElement(ResponsivePieCanvas, this.getProps()),
        this.getRootDomNode()
      );
    }
  }
}
