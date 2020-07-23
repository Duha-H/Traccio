import { createElement, Attributes } from "react";
import { render } from "react-dom";

import { Component, Input } from "@angular/core";
import { ReactWrapper } from "./react-wrapper.component";
import { ResponsiveLineCanvas, LineCanvasProps, Serie, DatumValue, Layer, PointMouseHandler, SliceTooltip, PointTooltip } from "@nivo/line";
import { Scale } from "@nivo/scales";
import { CartesianMarkerProps, Theme } from "@nivo/core";
import { OrdinalColorsInstruction } from "@nivo/colors";
import { GridValues, AxisProps } from "@nivo/axes";
import { CrosshairType } from "@nivo/tooltip";

@Component({
  selector: "line-chart-wrapper",
  template: '<span [id]="rootDomID"></span>',
})
export class ResponsiveLineComponent extends ReactWrapper {
  @Input() data: Serie[] = [
    {
      id: "thing 1",
      data: [
        {x: 0, y: 1},
        {x: 1, y: 4},
        {x: 2, y: 3},
        {x: 3, y: 2},
        {x: 4, y: 2},
      ],
      color: "hsl(200, 70%, 50%)"
    }
  ];
  @Input() xScale: Scale = {
    type: 'linear'
  };
  @Input() xFormat: string | any;
  @Input() yScale: Scale = {
    type: 'linear'
  };
  @Input() yFormat: string | any;
  @Input() layers: Layer[] = ['grid', 'markers', 'axes', 'areas', 'crosshair', 'lines', 'points', 'slices', 'mesh', 'legends'];
  @Input() margin: {} = {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  };
  @Input() curve:
      | 'basis'
      | 'cardinal'
      | 'catmullRom'
      | 'linear'
      | 'monotoneX'
      | 'monotoneY'
      | 'natural'
      | 'step'
      | 'stepAfter'
      | 'stepBefore' = 'linear';
  @Input() lineWidth: number = 2;
  @Input() colors: OrdinalColorsInstruction;
  @Input() theme: Theme;
  @Input() axisTop: AxisProps | null;
  @Input() axisRight: AxisProps | null;
  @Input() axisBottom: AxisProps | null;
  @Input() axisLeft: AxisProps | null;
  @Input() enableGridX: boolean;
  @Input() gridXValues: GridValues<DatumValue>;
  @Input() enableGridY: boolean;
  @Input() gridYValues: GridValues<DatumValue>;
  @Input() enablePoints: boolean;
  @Input() pointSymbol: (props: Readonly<any>) => React.ReactNode;
  @Input() pointSize: number;
  @Input() pointColor: any;
  @Input() pointBorderWidth: number;
  @Input() pointBorderColor: any;
  @Input() enableArea: boolean;
  @Input() areaOpacity: number;
  @Input() areaBaselineValue: DatumValue;
  @Input() markers: CartesianMarkerProps[];
  @Input() isInteractive: boolean;
  @Input() onMouseEnter: PointMouseHandler;
  @Input() onMouseMove: PointMouseHandler;
  @Input() onMouseLeave: PointMouseHandler;
  @Input() onClick: PointMouseHandler;
  @Input() debugMesh: boolean;
  @Input() enableSlices: 'x' | 'y' | false;
  @Input() debugSlices: boolean;
  @Input() sliceTooltip: SliceTooltip;
  @Input() tooltipFormat: ((value: DatumValue) => string | number) | string;
  @Input() tooltip: PointTooltip;
  @Input() enableCrosshair: boolean;
  @Input() crosshairType: CrosshairType;
  @Input() legends: any;

  protected getProps(): Attributes & LineCanvasProps {
    const {
      data,
      xScale,
      xFormat,
      yScale,
      yFormat,
      layers,
      margin,
      curve,
      lineWidth,
      colors,
      theme,
      axisTop,
      axisRight,
      axisBottom,
      axisLeft,
      enableGridX,
      gridXValues,
      enableGridY,
      gridYValues,
      enablePoints,
      pointSymbol,
      pointSize,
      pointColor,
      pointBorderWidth,
      pointBorderColor,
      enableArea,
      areaOpacity,
      areaBaselineValue,
      markers,
      isInteractive,
      onMouseEnter,
      onMouseMove,
      onMouseLeave,
      onClick,
      debugMesh,
      enableSlices,
      debugSlices,
      sliceTooltip,
      tooltipFormat,
      tooltip,
      enableCrosshair,
      crosshairType,
      legends,
    } = this;
    return {
      data,
      xScale,
      xFormat,
      yScale,
      yFormat,
      layers,
      margin,
      curve,
      lineWidth,
      colors,
      theme,
      axisTop,
      axisRight,
      axisBottom,
      axisLeft,
      enableGridX,
      gridXValues,
      enableGridY,
      gridYValues,
      enablePoints,
      pointSymbol,
      pointSize,
      pointColor,
      pointBorderWidth,
      pointBorderColor,
      enableArea,
      areaOpacity,
      areaBaselineValue,
      markers,
      isInteractive,
      onMouseEnter,
      onMouseMove,
      onMouseLeave,
      onClick,
      debugMesh,
      enableSlices,
      debugSlices,
      sliceTooltip,
      tooltipFormat,
      tooltip,
      enableCrosshair,
      crosshairType,
      legends,
    };
  }

  private isMounted(): boolean {
    return !!this.rootDomID;
  }

  protected render() {
    if (this.isMounted()) {
      render(
        createElement(ResponsiveLineCanvas, this.getProps()),
        this.getRootDomNode()
      );
    }
  }
}
