import {Component, Input, OnInit} from '@angular/core';
import {PlayingCardState, PlayingCardType} from "../../../../enums/playing-cards.enum";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-playing-card',
  templateUrl: './playing-card.component.html',
  styleUrls: ['./playing-card.component.less'],
  animations: [
    trigger('flipCard', [
      state('shown', style({
        transform: 'rotateY(0deg)'
      })),
      state('hidden', style({
        transform: 'rotateY(180deg)'
      })),
      transition('hidden <=> shown', [
        animate('200ms')
      ])
    ]),
  ]
})
export class PlayingCardComponent implements OnInit {

  animationState = 'hidden';
  @Input() playingCardType: PlayingCardType = PlayingCardType.GESCHUETTELT;
  @Input() isStack: boolean = true;

  state: PlayingCardState = PlayingCardState.HIDDEN;

  constructor() { }

  ngOnInit(): void {
  }

  getPlayingCardTypeString() {
    switch(this.playingCardType) {
      case PlayingCardType.BEKANNT:
        return "Bekannt";
      case PlayingCardType.GEFRAGT:
        return "Gefragt";
      case PlayingCardType.GESCHUETTELT:
        return "Geschüttelt";
      case PlayingCardType.ANGESETZT:
        return "Angesetzt";
      case PlayingCardType.ORIGINAL:
      default:
        return "Original";
    }
  }

  flipCard(): void {
    if(this.state === PlayingCardState.HIDDEN) {
      this.animationState = 'shown';
      this.state = PlayingCardState.OPEN;
    } else if(this.state === PlayingCardState.OPEN) {
      this.animationState = 'hidden';
      this.state = PlayingCardState.HIDDEN;
    }

    console.log(this.animationState);
    console.log(this.state);
  }

}
