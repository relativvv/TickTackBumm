import {Component, Input, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-starting-countdown',
  templateUrl: './starting-countdown.component.html',
  styleUrls: ['./starting-countdown.component.less'],
  animations: [
    trigger('fadeTimer', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('300ms', style({ opacity: 0 }))
      ]),
    ])
  ],
})
export class StartingCountdownComponent implements OnInit {

  @Input() timer: number;

  constructor() { }

  ngOnInit(): void {
  }

}
