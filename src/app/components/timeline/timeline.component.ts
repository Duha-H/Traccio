import { OnInit, Component, ViewChild, ElementRef, Input } from '@angular/core';
import { TimelineDatum } from 'src/app/models/types';
import { STATUS } from 'src/app/models/constants';
import { TimelinePropType } from '../types';

@Component({
  selector: "timeline",
  template: '\
  <div style="width: 100%; height: 150px; display: grid; align-items: center; align-content: center;" #parent>\
    <div *ngIf="displayTooltip"\
    style="background: var(--element-bg-primary); position: absolute; z-index: 30;\
      top: {{tooltipPosition.y}}px; left: {{tooltipPosition.x}}px;">\
      <h3>HERE {{marker.status}}</h3>\
    </div>\
    <canvas (mousemove)="onMouseHover($event)" (mouseLeave)="onMouseLeave()" #canvas></canvas>\
  </div>\
  ',
  styleUrls: []
})
export class TimelineComponent implements OnInit {

  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  canvasX: number;
  canvasY: number;
  xMarkerPositions: number[];
  mouseOverCanvas = false;
  marker: TimelineDatum;
  displayTooltip = false;
  tooltipPosition = {
    x: 0, y: 0
  };
  pixelRatio: number;

  @Input() timelineProps: TimelinePropType = defaultProps;
  @Input() timelineData: TimelineDatum[] = placeholderData;
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('parent', { static: true }) parentDiv: ElementRef<HTMLDivElement>;

  ngOnInit() {
    window.addEventListener('resize', () => {
      // responsive width on resize
      this._calibrateCanvas();
      this.draw();
    });
    console.log(this.parentDiv.nativeElement);
    if (!this.timelineData) {
      throw new TypeError('Timeline data not specified.');
    }
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this._calibrateCanvas();
    this.draw();
  }

  draw() {
    // const positions = this._computeMarkerPositions();
    const y = this.height / 2;
    this.ctx.lineWidth = this.timelineProps.size;
    this.ctx.strokeStyle = this.timelineProps.colors[0];
    this.ctx.fillStyle = this.timelineProps.colors[0];
    // draw lines
    for (let i = 1; i < this.xMarkerPositions.length; i++) {
      const x = this.xMarkerPositions[i];
      // draw line
      this.ctx.beginPath();
      this.ctx.moveTo(this.xMarkerPositions[i - 1], y);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      // update styles for next marker
      this.ctx.strokeStyle = this.timelineProps.colors[i];
      this.ctx.fillStyle = this.timelineProps.colors[i];
    }
    this.ctx.strokeStyle = this.timelineProps.colors[0];
    this.ctx.fillStyle = this.timelineProps.colors[0];
    // draw markers (drawing them separately for now to make sure that markers are on top)
    for (let i = 1; i < this.xMarkerPositions.length; i++) {
      const x = this.xMarkerPositions[i];
      // draw marker
      this.drawMarker(x, y, MARKER_WIDTH, MARKER_HEIGHT);
      // update styles for next marker
      this.ctx.strokeStyle = this.timelineProps.colors[i];
      this.ctx.fillStyle = this.timelineProps.colors[i];
    }
  }

  onMouseHover(event: MouseEvent) {
    this.mouseOverCanvas = true;
    const marker = this._getMarkerOnHover((event.x - this.canvasX) * this.pixelRatio, (event.y - this.canvasY) * this.pixelRatio);
    // console.log(event.x, event.y);
    if (marker) {
      // console.log(marker);
      this.marker = marker;
      this.displayTooltip = true;
      this.tooltipPosition = {
        x: (event.x - this.canvasX),
        y: event.y + 50
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
    const parentRect = this.parentDiv.nativeElement.getBoundingClientRect();
    const parentWidth = this.parentDiv.nativeElement.offsetWidth;
    const parentHeight = this.parentDiv.nativeElement.offsetHeight;
    // console.log(this.parentDiv.nativeElement.getBoundingClientRect());
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
    this.xMarkerPositions = this._computeMarkerPositions();
  }

  private _computeMarkerPositions(): number[] {
    const positions = [];
    const adjustedWidth = this.width - (MARKER_WIDTH / 2);
    const today = new Date();
    const start = this.timelineData[0].date;
    const timeElapsed = today.getTime() - start.getTime();
    this.timelineData.forEach(item => {
      const statusTimeElapsed = today.getTime() - item.date.getTime();
      const newPosition = this.width - ( (adjustedWidth * statusTimeElapsed) / timeElapsed );
      positions.push(newPosition);
    });
    positions.push(adjustedWidth);

    return positions;
  }

  private _getMarkerOnHover(cursorX: number, cursorY: number) {
    const y = this.height / 2;
    const yBounds = {
      min: y - HOVER_THRESHOLD_Y,
      max: y + HOVER_THRESHOLD_Y
    };
    let marker;
    for (let i = 0; i < this.xMarkerPositions.length; i++) {
      const x = this.xMarkerPositions[i];
      const xBounds = {
        min: x - HOVER_THRESHOLD_X,
        max: x + HOVER_THRESHOLD_X
      };
      if (
        cursorX >= xBounds.min &&
        cursorX <= xBounds.max &&
        cursorY >= yBounds.min &&
        cursorY <= yBounds.max
      ) {
        console.log('over a marker');
        marker = this.timelineData[i - 1];
      }
    }
    return marker;
  }

  drawMarker(centerX: number, centerY: number, width: number, height: number, fill?: boolean, stroke?: boolean) {
    // Partial reference: https://stackoverflow.com/a/3368118/11526051
    if (!fill) {
      fill = true;
    }
    if (!stroke) {
      stroke = false;
    }
    /**
     * points diagram (marker is a rectangle with rounded corners)
     * (arc intersections represent where rounded corner arcs meet)
     *          topArcIntersection
     *                /\
     *               /  \
     *              /    \
     *    topLeft  |     | topRight
     *             |     |
     *             |     |
     *             |     |
     *             |     |
     *  bottomLeft |     | bottomRight
     *             \    /
     *              \  /
     *               \/
     *        bottomArcIntersection
     */
    const radius = width / 2;
    const p = { // point positions
      topArcIntersection: {
        x: centerX, y: centerY - (height / 2)
      },
      topRight: {
        x: centerX + radius, y: centerY - (height / 2) + radius
      },
      bottomRight: {
        x: centerX + radius, y: centerY + (height / 2) - radius
      },
      bottomArcIntersection: {
        x: centerX, y: centerY + (height / 2)
      },
      bottomLeft: {
        x: centerX - radius, y: centerY + (height / 2) - radius
      },
      topLeft: {
        x: centerX - radius, y: centerY - (height / 2) + radius
      }
    };
    const cp = { // control point positions
      topRight: {
        x: centerX + radius, y: centerY - (height / 2)
      },
      bottomRight: {
        x: centerX + radius, y: centerY + (height / 2)
      },
      bottomLeft:  {
        x: centerX - radius, y: centerY + (height / 2)
      },
      topLeft: {
        x: centerX - radius, y: centerY - (height / 2)
      }
    };
    this.ctx.beginPath();
    this.ctx.moveTo(p.topArcIntersection.x, p.topArcIntersection.y);
    this.ctx.arcTo(cp.topRight.x, cp.topRight.y, p.topRight.x, p.topRight.y, radius);
    this.ctx.lineTo(p.bottomRight.x, p.bottomRight.y);
    this.ctx.arcTo(cp.bottomRight.x, cp.bottomRight.y, p.bottomArcIntersection.x, p.bottomArcIntersection.y, radius);
    this.ctx.arcTo(cp.bottomLeft.x, cp.bottomLeft.y, p.bottomLeft.x, p.bottomLeft.y, radius);
    this.ctx.lineTo(p.topLeft.x, p.topLeft.y);
    this.ctx.arcTo(cp.topLeft.x, cp.topLeft.y, p.topArcIntersection.x, p.topArcIntersection.y, radius);
    if (fill) {
      this.ctx.fill();
    }
    if (stroke) {
      this.ctx.stroke();
    }
  }

}

export const placeholderData = [
  { status: STATUS.IN_REVIEW, date: new Date("2020-01-01") },
  { status: STATUS.ASSESSMENT, date: new Date("2020-03-01") },
  { status: STATUS.INTERVIEW, date: new Date("2020-03-12") },
  { status: STATUS.OFFER, date: new Date("2020-04-05") },
];

export const defaultProps: TimelinePropType = {
  width: 600,
  height: 100,
  size: 7.5,
  colors: ['#E76F51', '#F4A261', '#E9C46A', '#2A9D8F', '#264653', '#A6A8A8'],
  isInteractive: true
};

const MARKER_WIDTH = 15;
const MARKER_HEIGHT = 50;
const MARKER_RADIUS = MARKER_WIDTH / 2;
const HOVER_THRESHOLD_X = (MARKER_WIDTH / 2) * 1.5;
const HOVER_THRESHOLD_Y = (MARKER_HEIGHT / 2) * 1.5;
