import { Component, OnInit, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  stagger,
  keyframes,
} from '@angular/animations';

@Component({
  selector: 'graphic-dashboard',
  templateUrl: './dashboard-graphic.component.html' ,
  styleUrls: ['../landing-cards.css', '../landing.component.css'],
  animations: [
    trigger('visible', [
      state('hidden', style({
        opacity: 0.5,
      })),
      state('visible', style({
        opacity: 1,
      })),
      transition('hidden => visible', [
        animate('2s'),
        // query('#graph-week', style({
        //   opacity: 0,
        // }))
        query('#graph-week', [
          style({ opacity: 1 }),
          stagger(100, [
            animate('0.5s', style({ opacity: 0 })),
          ])
        ]),
        query('#graph-month', [
          style({ opacity: 0 }),
          stagger(200, [
            animate('0.5s', style({ opacity: 1 })),
          ])
        ])
      ]),
    ]),

    trigger('showDashGraphic', [
      state('hidden', style({
        opacity: 0.5,
      })),
      state('visible', style({
        opacity: 1,
      })),
      state('weekToggleClick', style({}), { params: {
        showWeek: true,
        showMonth: false,
      }}),
      state('showMonth', style({}), { params: {
        showWeek: false,
        showMonth: true,
      }}),
      // transitions
      transition('hidden => visible', animate('1s')),

      transition('visible => weekToggleClick', [
        animate('2s'),
        query('#toggle-week', [
          style({
            opacity: 1,
            transform: 'scale(0.8)'
          }),
          stagger(500, [
            animate('1s', keyframes([
              style({
                opacity: 1,
                transform: 'scale(1.95)'
              }),
              style({
                opacity: 1,
                transform: 'scale(1)'
              })
            ])),
          ])
        ]),
        query('#graph-week', style({ opacity: 1 })),
      ]),

      transition('weekToggleClick => showMonth', [
        animate('2s'),
        query('#toggle-week', style({ opacity: 0 })),
        query('#graph-week', style({ opacity: 0 })),
        query('#toggle-month', style({ opacity: 1 })),
        query('#graph-month', style({ opacity: 1 })),
      ])
    ])

  ]
})
export class DashboardGraphicComponent implements OnInit {

  @Input() visible = false;

  ngOnInit() {  }
}
