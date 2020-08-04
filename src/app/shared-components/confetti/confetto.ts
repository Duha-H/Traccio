import * as utils from './utils';

/**
 * Object representation of a single Confetto
 */

interface ValuePair {
  x: number;
  y: number;
}

interface Color {
  side1: string;
  side2: string;
}

const CONFETTO_WIDTH = 25;
const CONFETTO_HEIGHT = 40;

export class Confetto {

  position: ValuePair = {
    x: 0,
    y: 0
  };
  rotation = 0;
  velocity: ValuePair = {
    x: 5,
    y: 30,
  };
  firingVelocity: ValuePair = {
    x: 0,
    y: utils.randomNumberInRange(150, 230)
  };
  scale = {
    x: 1,
    y: 1,
  };
  maxHeight = 50;
  color: Color = {
    side1: '#E76F51',
    side2: '#E76F51'
  };
  falling = false;

  constructor(position: ValuePair, rotation: number, velocity: ValuePair, color: Color, maxHeight: number) {
    this.position = position;
    this.rotation = rotation;
    this.velocity = velocity;
    this.color = color;
    this.maxHeight = maxHeight;
  }

  inFrame(width: number, height: number): boolean {
    if (this.position.x > (width + CONFETTO_WIDTH) || this.position.y > (height + CONFETTO_HEIGHT)) {
      return false;
    } else {
      return true;
    }
  }
}
