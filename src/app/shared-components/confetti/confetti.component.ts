import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { ConfettiPropType } from '../types';
import * as utils from './utils';
import { Confetto } from './confetto';
import { MatHeaderCell } from '@angular/material/table';

@Component({
  selector: 'confetti',
  template: '<canvas #canvas></canvas>',
  styleUrls: ['confetti.component.css']
})
export class ConfettiComponent implements OnInit {

  ctx: CanvasRenderingContext2D;
  darkerColors: string[] = [];
  confetti: Confetto[] = [];
  canvasWidth: number;
  canvasHeight: number;
  animating = false;

  @Input() props: ConfettiPropType;
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  ngOnInit() {
    if (!this.props) {
      this.props = DEFAULT_PROPS;
    } else {
      this.props = Object.assign({}, DEFAULT_PROPS, this.props);
    }
    this.props.colors.forEach(color => {
      this.darkerColors.push(utils.shadeHexColor(color, -30));
    });
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.width = window.innerWidth * window.devicePixelRatio;
    this.canvas.nativeElement.height = window.innerHeight * window.devicePixelRatio;
    this.canvasWidth = this.canvas.nativeElement.width;
    this.canvasHeight = this.canvas.nativeElement.height;
    // window.addEventListener('keydown', (event) => this.keyboardHandler(event));
    this.initConfetti();
  }

  initConfetti() {
    const colorCount = this.props.colors.length;
    for (let i = 0; i < this.props.count; i++) {
      this.confetti.push(new Confetto(
        {
          x: Math.random() * this.canvasWidth,
          y: this.canvasHeight + 50,
        },
        utils.randomNumberInRange(0, 2 * Math.PI),
        {
          x: utils.randomNumberInRange(30, 50),
          y: utils.randomNumberInRange(25, 40), // 25, 40
        },
        {
          side1: this.props.colors[i % colorCount],
          side2: this.darkerColors[i % colorCount],
        },
        utils.randomNumberInRange(10, this.canvasHeight / 5),
      ));
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    this.confetti.forEach((confetto, index) => {
      confetto.scale.y = Math.cos(confetto.position.y * 0.8);
      this.ctx.fillStyle = confetto.color.side1;
      // apply confetto transformations
      this.ctx.translate(confetto.position.x, confetto.position.y);
      this.ctx.rotate(confetto.rotation);
      if (confetto.falling) {
        this.ctx.scale(1, confetto.scale.y);
      }
      // draw confetto
      this.ctx.fillRect(-CONFETTO_WIDTH / 2, -CONFETTO_HEIGHT / 2, CONFETTO_WIDTH, CONFETTO_HEIGHT);
      // undo confetto transformations
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);

      if (confetto.falling && !confetto.inFrame(this.canvasWidth, this.canvasHeight)) { // if out of frame, remove from confetti array
        this.confetti.splice(index, 1);
      } else { // update confetto position
        if (confetto.position.y < confetto.maxHeight) {
          confetto.falling = true;
        }
        if (confetto.falling) {
          confetto.position.y += confetto.velocity.y * (confetto.position.y / this.canvasHeight) + 10;
        } else {
          confetto.position.y -= confetto.firingVelocity.y * (confetto.position.y / this.canvasHeight) + 2;
        }
      }
    });

    if (this.confetti.length > 0) { // if some confetti remains, continue animating
      this.animating = true;
      window.requestAnimationFrame(this.draw.bind(this));
    } else {
      this.animating = false;
      this.initConfetti(); // regenerate confetti for next re-draw
    }
  }

  onMouseOver(event: MouseEvent) {
    if (this.confetti.length !== 0) {
      this.draw();
    }
  }

  keyboardHandler(event: KeyboardEvent) {
    if (event.keyCode === 67) { // 'c'
      if (!this.animating) {
        this.draw();
      }
    }
  }
}

const DEFAULT_PROPS: ConfettiPropType = {
  colors: ['#E76F51', '#F4A261', '#E9C46A', '#2A9D8F', '#264653', '#A6A8A8'],
  animDuration: 5000,
  count: 70,
};
const CONFETTO_WIDTH = 25;
const CONFETTO_HEIGHT = 40;
