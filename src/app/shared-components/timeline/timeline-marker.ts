export class TimelineMarker {

  // private _ctx: CanvasRenderingContext2D;
  private _id: number;
  private _x: number;
  private _y: number;
  private _shape: 'circle' | 'rounded-rect';
  private _payload: any;

  constructor(id?: number, x?: number, y?: number, shape?: 'circle' | 'rounded-rect', payload?: any) {
    this._id = id ? id : 0;
    this._x = x ? x : 0;
    this._y = y ? y : 0;
    this._shape = shape ? shape : 'rounded-rect';
    this._payload = payload ? payload : null;
  }

  get id() { return this._id; }

  get x() { return this._x; }
  set x(value: number) { this._x = value; }

  get y() { return this._y; }
  set y(value: number) { this._y = value; }

  get shape() { return this._shape; }
  set shape(value: 'circle' | 'rounded-rect') { this._shape = value; }

  get payload() { return this._payload; }
  set payload(value: any) { this._payload = value; }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number, fill?: boolean, stroke?: boolean) {
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
        x: this.x, y: this.y - (height / 2)
      },
      topRight: {
        x: this.x + radius, y: this.y - (height / 2) + radius
      },
      bottomRight: {
        x: this.x + radius, y: this.y + (height / 2) - radius
      },
      bottomArcIntersection: {
        x: this.x, y: this.y + (height / 2)
      },
      bottomLeft: {
        x: this.x - radius, y: this.y + (height / 2) - radius
      },
      topLeft: {
        x: this.x - radius, y: this.y - (height / 2) + radius
      }
    };
    const cp = { // control point positions
      topRight: {
        x: this.x + radius, y: this.y - (height / 2)
      },
      bottomRight: {
        x: this.x + radius, y: this.y + (height / 2)
      },
      bottomLeft:  {
        x: this.x - radius, y: this.y + (height / 2)
      },
      topLeft: {
        x: this.x - radius, y: this.y - (height / 2)
      }
    };
    ctx.beginPath();
    ctx.moveTo(p.topArcIntersection.x, p.topArcIntersection.y);
    ctx.arcTo(cp.topRight.x, cp.topRight.y, p.topRight.x, p.topRight.y, radius);
    ctx.lineTo(p.bottomRight.x, p.bottomRight.y);
    ctx.arcTo(cp.bottomRight.x, cp.bottomRight.y, p.bottomArcIntersection.x, p.bottomArcIntersection.y, radius);
    ctx.arcTo(cp.bottomLeft.x, cp.bottomLeft.y, p.bottomLeft.x, p.bottomLeft.y, radius);
    ctx.lineTo(p.topLeft.x, p.topLeft.y);
    ctx.arcTo(cp.topLeft.x, cp.topLeft.y, p.topArcIntersection.x, p.topArcIntersection.y, radius);
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  }

  drawDateLabel(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.setLineDash([10, 5]);
    ctx.moveTo(this._x, this._y - 80);
    ctx.lineTo(this._x, this._y);
    ctx.stroke();
  }
}
