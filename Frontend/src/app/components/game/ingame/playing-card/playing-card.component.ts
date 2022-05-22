import {Component, Input, OnInit} from '@angular/core';
import {PlayingCardType} from "../../../../../enums/playing-cards.enum";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Game} from "../../../../../models/game.model";
import {Player} from "../../../../../models/player.model";

@Component({
  selector: 'app-playing-card',
  templateUrl: './playing-card.component.html',
  styleUrls: ['./playing-card.component.less'],
  animations: [
    trigger('flipCard', [
      state('hidden', style({
        transform: 'rotateY(0deg)'
      })),
      state('shown', style({
        transform: 'rotateY(180deg)'
      })),
      transition('hidden <=> shown', [
        animate('400ms')
      ])
    ]),
  ]
})
export class PlayingCardComponent implements OnInit {

  cardState = 'hidden';
  @Input() playingCardType: PlayingCardType = PlayingCardType.GESCHUETTELT;
  @Input() game: Game;
  @Input() player: Player;

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
    if(this.game.currentPlayer.resourceId === this.player.resourceId) {
      this.cardState === 'hidden' ? this.cardState = 'shown' : this.cardState = 'hidden';
    }
  }
}
