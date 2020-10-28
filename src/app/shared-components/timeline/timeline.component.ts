import { OnInit, Component, ViewChild, ElementRef, Input, AfterViewInit, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { TimelineDatum } from 'src/app/models/types';
import { STATUS } from 'src/app/models/constants';
import { TimelinePropType, TimelineTooltipPropType } from '../types';
import { TimelineMarker } from './timeline-marker';
import { msToDays, collision } from './utils';
import * as utils from 'src/app/controllers/utils';
import { TimelineTooltipComponent } from './timeline-tooltip.component';

@Component({
  selector: "timeline",
  template: '\
  <div id="timeline-parent" #parent>\
    <timeline-tooltip *ngIf="displayTooltip" [props]="tooltipProps" style="position: fixed;\
      z-index: 15; top: {{tooltipProps.y}}px; left: {{tooltipProps.x}}px;" \
      (tooltipAdjustment)="tooltipProps.x=$event" #tooltip></timeline-tooltip>\
    <canvas (mousemove)="onMouseHover($event)" (mouseleave)="onMouseLeave()" (click)="onMouseClick($event)" #canvas></canvas>\
  </div>\
  ',
  styleUrls: ['timeline.component.css']
})
export class TimelineComponent implements OnInit, AfterViewInit {

  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  canvasX: number;
  canvasY: number;
  markers: TimelineMarker[] = [];
  displayTooltip = false;
  tooltipProps: TimelineTooltipPropType = { x: 0, y: 0 };
  pixelRatio: number;
  markerOnHover: TimelineMarker;

  @Input() props: TimelinePropType;
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('parent', { static: true }) parentDiv: ElementRef<HTMLDivElement>;
  @ViewChild('tooltip', { static: false, read: ElementRef }) tooltip: ElementRef<HTMLElement>;

  ngOnInit() {
    if (!this.props) {
      throw new TypeError('Timeline props not specified.');
    }
    this.props = Object.assign({}, defaultProps, this.props);
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.draw();
    // make size responsive to window resize and trigger re-draw
    window.addEventListener('resize', () => {
      this.draw();
    });
  }

  ngAfterViewInit() {
    this.draw();
  }

  updateProps(newProps: TimelinePropType) {
    this.props = Object.assign({}, this.props, newProps);
    this.draw(); // trigger re-draw
  }

  draw() {
    this._calibrateCanvas();
    this.ctx.lineWidth = this.props.size;
    // draw lines
    for (let i = 0; i < this.markers.length; i++) {
      // update styles for next marker
      this.ctx.strokeStyle = this.markers[i].payload.color;
      this.ctx.fillStyle = this.markers[i].payload.color;
      const x = this.markers[i].x;
      const y = this.markers[i].y;
      let nextPoint;
      if (i < this.markers.length - 1) {
        nextPoint = {
          x: this.markers[i + 1].x,
          y: this.markers[i + 1].y,
        };
      } else {
        nextPoint = { x: this.width, y: this.markers[0].y };
      }
      // draw line
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(nextPoint.x, nextPoint.y);
      this.ctx.stroke();
    }
    // draw markers (drawing them separately for now to make sure that markers are on top)
    this.markers.forEach(marker => {
      this.ctx.strokeStyle = marker.payload.color;
      this.ctx.fillStyle = marker.payload.color;
      marker.draw(this.ctx, MARKER_WIDTH, MARKER_HEIGHT, true, false);
    });
    // draw ending marker/tick
    this.ctx.strokeStyle = '#797f85';
    this.ctx.fillStyle = '#797f85';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(this.width, this.markers[0].y - (MARKER_HEIGHT / 2) + MARKER_RADIUS);
    this.ctx.lineTo(this.width, this.markers[0].y + (MARKER_HEIGHT / 2) - MARKER_RADIUS);
    this.ctx.stroke();
  }

  onMouseHover(event: MouseEvent) {
    // detect collisions with markers
    const markerOnHover = this._getMarkerOnHover((event.x - this.canvasX) * this.pixelRatio, (event.y - this.canvasY) * this.pixelRatio);
    if (markerOnHover) {
      this.markerOnHover = markerOnHover;
      this.displayTooltip = true;
      this.tooltipProps = {
        x: event.x,
        y: event.y + 30,
        // text: `${markerOnHover.payload.status}: ${markerOnHover.payload.duration} day${markerOnHover.payload.duration === 1 ? '' : 's'}`,
        text: `${markerOnHover.payload.status}: ${utils.getDateString(markerOnHover.payload.date)}`,
        color: markerOnHover.payload.color
      };
    } else {
      this.markerOnHover = undefined;
      this.displayTooltip = false;
    }
  }

  adjustMarkerPosition(posX: number): number {
    const rect = this.tooltip.nativeElement.getBoundingClientRect();
    const width = rect.right - rect.left;
    let markerPosition = posX;
    if (window.innerWidth - rect.left < width + 20) { // if tooltip is extending beyond window width
      markerPosition = rect.left - width;
    }
    return markerPosition;
  }

  onMouseLeave() {
    this.displayTooltip = false;
  }

  onMouseClick(event: MouseEvent) {
    console.log('click');
    this.onMouseHover(event);
  }

  private _calibrateCanvas() {
    // called on window resize
    // adjusts canvas position (bounds), width & height, pixel ratio, and marker positions
    const parentWidth = this.parentDiv.nativeElement.offsetWidth;
    const parentHeight = this.parentDiv.nativeElement.offsetHeight;
    this.pixelRatio = window.devicePixelRatio;
    // adjust canvas size relative to pixel ratio
    this.canvas.nativeElement.width = parentWidth * this.pixelRatio;
    this.canvas.nativeElement.height = parentHeight * this.pixelRatio;
    this.canvas.nativeElement.style.width = `${parentWidth}px`;
    this.canvas.nativeElement.style.height = `${parentHeight}px`;
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    this.canvasX = rect.left;
    this.canvasY = rect.top;
    // update size and marker positions
    this.width = this.canvas.nativeElement.width;
    this.height = this.canvas.nativeElement.height;
    this._generateMarkersFromData();
  }

  private _generateMarkersFromData() {
    this.markers = []; // clear current markers
    const adjustedWidth = this.width - MARKER_WIDTH;
    const y = this.height / 2; // centered vertically in canvas
    const today = new Date();
    if (this.props.data.length > 0) {
      const start = this.props.data[0].date;
      const totalTimeElapsed = today.getTime() - start.getTime();
      let prevX = 0;
      for (let i = 0; i < this.props.data.length; i++) {
        const item = this.props.data[i];
        const nextItem = this.props.data[i + 1];
        const nextDate = nextItem ? nextItem.date : today;
        const statusTimeElapsed = item.date.getTime() - start.getTime();
        const ratio = statusTimeElapsed / totalTimeElapsed;
        const newX = (ratio * adjustedWidth) + (MARKER_WIDTH / 2);
        if (newX - prevX < MARKER_WIDTH && this.markers[i - 1]) {
          // correcting for markers that end up being too close to be discernible
          this.markers[i - 1].x -= MARKER_WIDTH;
        }
        const markerColor = this.props.colorMappings && this.props.colorMappings[item.status]
          ? this.props.colorMappings[item.status]
          : this.props.colors[i];
        const newMarker = new TimelineMarker(i, newX, y, 'rounded-rect', {
          ...item,
          duration: msToDays(nextDate.getTime() - item.date.getTime()),
          color: markerColor
        });
        this.markers.push(newMarker);
        prevX = newX;
      }
    }
  }

  private _getMarkerOnHover(cursorX: number, cursorY: number) {
    let markerOnHover: TimelineMarker | undefined;
    for (const marker of this.markers) {
      const x = marker.x;
      const y = marker.y;
      if (collision(cursorX, cursorY, x, y, HOVER_THRESHOLD_X, HOVER_THRESHOLD_Y)) {
        markerOnHover = marker;
      }
    }
    return markerOnHover;
  }

}

export const placeholderData = [
  { status: STATUS.IN_REVIEW, date: new Date("2020-01-01") },
  { status: STATUS.ASSESSMENT, date: new Date("2020-03-01") },
  { status: STATUS.INTERVIEW, date: new Date("2020-03-12") },
  { status: STATUS.OFFER, date: new Date("2020-04-05") },
  { status: STATUS.STALE, date: new Date("2020-04-06") },
];

const MARKER_WIDTH = 15;
const MARKER_HEIGHT = 52.5;
const MARKER_RADIUS = MARKER_WIDTH / 2;
const HOVER_THRESHOLD_X = (MARKER_WIDTH / 2) * 2;
const HOVER_THRESHOLD_Y = (MARKER_HEIGHT / 2) * 2;

export const defaultProps: TimelinePropType = {
  width: 600,
  height: 100,
  data: placeholderData,
  size: 7.5,
  colors: ['#E76F51', '#F4A261', '#E9C46A', '#2A9D8F', '#264653', '#A6A8A8'],
  isInteractive: true
};
