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
      this.darkerColors.push(utils.shadeHexColor(color, 15));
    });
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.width = window.innerWidth * window.devicePixelRatio;
    this.canvas.nativeElement.height = window.innerHeight * window.devicePixelRatio;
    this.canvasWidth = this.canvas.nativeElement.width;
    this.canvasHeight = this.canvas.nativeElement.height;
    window.addEventListener('keydown', (event) => this.keyboardHandler(event));
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
          x: utils.randomNumberInRange(15, 30),
          y: utils.randomNumberInRange(10, 25)
        },
        {
          side1: this.props.colors[i % colorCount],
          side2: this.darkerColors[i % colorCount],
        },
        utils.randomNumberInRange(10, this.canvasHeight / 4),
      ));
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    this.confetti.forEach((confetto, index) => {
      confetto.scale.y = Math.cos(confetto.position.y * 0.3);
      // console.log(0.0005 * this.canvasHeight, this.ctx.globalAlpha);
      this.ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.side1 : confetto.color.side2;
      // apply confetto transformations
      this.ctx.translate(confetto.position.x, confetto.position.y);
      this.ctx.rotate(confetto.rotation);
      // draw confetto
      this.ctx.fillRect(0, 0, CONFETTO_WIDTH, CONFETTO_HEIGHT);
      // undo confetto transformations
      this.ctx.rotate(-confetto.rotation);
      this.ctx.translate(-confetto.position.x, -confetto.position.y);

      if (confetto.falling && !confetto.inFrame(this.canvasWidth, this.canvasHeight)) { // if out of frame, remove from confetti array
        this.confetti.splice(index, 1);
      } else { // update confetto position
        if (confetto.position.y < confetto.maxHeight) {
          confetto.falling = true;
        }
        if (confetto.falling) {
          confetto.position.x += Math.random() > 0.5 ? confetto.velocity.x : -confetto.velocity.x;
          confetto.position.y += confetto.velocity.y;
        } else {
          confetto.position.y -= confetto.firingVelocity.y * (confetto.position.y / this.canvasHeight) + 5;
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
  count: 50,
};
const CONFETTO_WIDTH = 20;
const CONFETTO_HEIGHT = 40;
