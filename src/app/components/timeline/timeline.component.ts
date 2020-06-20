import { OnInit, Component, ViewChild, ElementRef, Input } from '@angular/core';
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
export class TimelineComponent implements OnInit {

  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  canvasX: number;
  canvasY: number;
  markerPositions: {x: number, y: number, duration: number}[] = [];
  mouseOverCanvas = false;
  marker: TimelineDatum;
  markers: TimelineMarker[] = [];
  displayTooltip = false;
  tooltipProps: TimelineTooltipPropType;
  pixelRatio: number;

  @Input() timelineProps: TimelinePropType = defaultProps;
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('parent', { static: true }) parentDiv: ElementRef<HTMLDivElement>;

  ngOnInit() {
    window.addEventListener('resize', () => {
      // responsive width on resize
      this._calibrateCanvas();
      this.draw();
    });
    console.log(this.parentDiv.nativeElement);
    if (!this.timelineProps.data) {
      throw new TypeError('Timeline data not specified.');
    }
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this._calibrateCanvas();
    this.draw();
  }

  draw() {
    this.ctx.lineWidth = this.timelineProps.size;
    this.ctx.strokeStyle = this.timelineProps.colors[0];
    this.ctx.fillStyle = this.timelineProps.colors[0];
    // draw line to first marker
    if (this.markers.length > 0) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.markers[0].y);
      this.ctx.lineTo(this.markers[0].x, this.markers[0].y);
      this.ctx.stroke();
    }
    // draw remaining lines
    for (let i = 1; i < this.markers.length; i++) {
      // update styles for next marker
      this.ctx.strokeStyle = this.timelineProps.colors[i];
      this.ctx.fillStyle = this.timelineProps.colors[i];
      const x = this.markers[i].x;
      const y = this.markers[i].y;
      // draw line
      this.ctx.beginPath();
      this.ctx.moveTo(this.markers[i - 1].x, this.markers[i - 1].y);
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
    this.mouseOverCanvas = true;
    // detect collisions with markers
    const markerOnHover = this._getMarkerOnHover((event.x - this.canvasX) * this.pixelRatio, (event.y - this.canvasY) * this.pixelRatio);
    if (markerOnHover) {
      this.displayTooltip = true;
      this.tooltipProps = {
        x: event.x - this.canvasX,
        y: event.y + 30,
        text: `${markerOnHover.payload.status}: ${markerOnHover.payload.duration} days`,
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
    const adjustedWidth = this.width - (MARKER_WIDTH / 2);
    const y = this.height / 2; // centered vertically in canvas
    const today = new Date();
    if (this.timelineProps.data.length > 0) {
      const start = this.timelineProps.data[0].date;
      const totalTimeElapsed = today.getTime() - start.getTime();
      let prevX = 0;
      for (let i = 0; i < this.timelineProps.data.length; i++) {
        const item = this.timelineProps.data[i];
        const nextItem = this.timelineProps.data[i + 1];
        let statusTimeElapsed;
        if (nextItem) {
          statusTimeElapsed =  nextItem.date.getTime() - item.date.getTime();
        } else {
          statusTimeElapsed =  today.getTime() - item.date.getTime();
        }
        const ratio = statusTimeElapsed / totalTimeElapsed;
        const newX = prevX + (ratio * adjustedWidth);
        if (newX - prevX < MARKER_WIDTH && this.markers[i - 1]) {
          // correcting for markers that end up being too close to be discernible
          this.markers[i - 1].x -= MARKER_WIDTH;
        }
        const newMarker = new TimelineMarker(newX, y, 'rounded-rect', {
          status: item.status,
          duration: msToDays(statusTimeElapsed),
          color: this.timelineProps.colors[i]
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
