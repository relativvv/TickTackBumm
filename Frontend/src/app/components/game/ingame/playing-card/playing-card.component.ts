import {Component, Input, OnInit} from '@angular/core';
import {PlayingCardState, PlayingCardType} from "../../../../../enums/playing-cards.enum";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Game} from "../../../../../models/game.model";
import {Player} from "../../../../../models/player.model";
import {GameStep} from "../../../../../enums/gamestep.enum";
import {GameService} from "../../../../../services/game.service";

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

  @Input() playingCardType: PlayingCardType = PlayingCardType.GESCHUETTELT;
  @Input() game: Game;
  @Input() player: Player;
  @Input() cardState: string;

  constructor(
    private readonly gameService: GameService
  ) { }

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
    if(this.game.currentPlayer.resourceId == this.player.resourceId && this.game.gameStep === GameStep.TURN_CARD) {
      this.cardState === PlayingCardState.HIDDEN ? this.cardState = PlayingCardState.OPEN : this.cardState = PlayingCardState.HIDDEN;
      this.game.gameStep = GameStep.BOMB_TICKING;
      this.gameService.sendGameUpdate(this.game);
    }
  }
}
