import { OnInit, Component, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { TimelineDatum } from 'src/app/models/types';
import { STATUS } from 'src/app/models/constants';
import { TimelinePropType, TimelineTooltipPropType } from '../types';
import { TimelineMarker } from './timeline-marker';
import { msToDays, collision } from './utils';

@Component({
  selector: "timeline",
  template: '\
  <div id="timeline-parent" #parent>\
    <timeline-tooltip *ngIf="displayTooltip" [props]="tooltipProps" style="position: absolute;\
      z-index: 15; top: {{tooltipProps.y}}px; left: {{tooltipProps.x}}px;"></timeline-tooltip>\
    <canvas (mousemove)="onMouseHover($event)" (mouseleave)="onMouseLeave()" #canvas></canvas>\
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
  tooltipProps: TimelineTooltipPropType;
  pixelRatio: number;

  @Input() props: TimelinePropType;
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('parent', { static: true }) parentDiv: ElementRef<HTMLDivElement>;

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
      let prevPoint;
      if (i > 0) {
        prevPoint = {
          x: this.markers[i - 1].x,
          y: this.markers[i - 1].y
        };
      } else {
        prevPoint = { x: 0, y: this.markers[0].y };
      }
      // draw line
      this.ctx.beginPath();
      this.ctx.moveTo(prevPoint.x, prevPoint.y);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    }
    // draw markers (drawing them separately for now to make sure that markers are on top)
    this.markers.forEach(marker => {
      this.ctx.strokeStyle = marker.payload.color;
      this.ctx.fillStyle = marker.payload.color;
      marker.draw(this.ctx, MARKER_WIDTH, MARKER_HEIGHT, true, false);
    });
  }

  onMouseHover(event: MouseEvent) {
    // detect collisions with markers
    const markerOnHover = this._getMarkerOnHover((event.x - this.canvasX) * this.pixelRatio, (event.y - this.canvasY) * this.pixelRatio);
    if (markerOnHover) {
      this.displayTooltip = true;
      this.tooltipProps = {
        // x: (markerOnHover.x + this.canvasX) / this.pixelRatio,
        // y: (markerOnHover.y / this.pixelRatio) + 30 + this.canvasY,
        x: (event.x - this.canvasX),
        y: event.y + 30,
        // text: `${markerOnHover.payload.status}: ${markerOnHover.payload.duration} day${markerOnHover.payload.duration === 1 ? '' : 's'}`,
        text: `${markerOnHover.payload.status}: ${markerOnHover.payload.date.toLocaleDateString()}`,
        color: markerOnHover.payload.color
      };
    } else {
      this.displayTooltip = false;
    }
  }

  onMouseLeave() {
    this.displayTooltip = false;
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
        let statusTimeElapsed: number;
        let nextDate: Date;
        if (nextItem) {
          statusTimeElapsed =  nextItem.date.getTime() - item.date.getTime();
          nextDate = nextItem.date;
        } else {
          statusTimeElapsed =  today.getTime() - item.date.getTime();
          nextDate = today;
        }
        const ratio = statusTimeElapsed / totalTimeElapsed;
        const newX = prevX + (ratio * adjustedWidth);
        if (newX - prevX < MARKER_WIDTH && this.markers[i - 1]) {
          // correcting for markers that end up being too close to be discernible
          this.markers[i - 1].x -= MARKER_WIDTH;
        }
        const markerColor = this.props.colorMappings && this.props.colorMappings[item.status]
          ? this.props.colorMappings[item.status]
          : this.props.colors[i];
        const newMarker = new TimelineMarker(newX, y, 'rounded-rect', {
          status: item.status,
          date: nextDate,
          duration: msToDays(statusTimeElapsed),
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
