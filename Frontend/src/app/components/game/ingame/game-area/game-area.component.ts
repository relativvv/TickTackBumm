import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlayingCard} from "../../../../../models/card.model";
import {Game} from "../../../../../models/game.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Player} from "../../../../../models/player.model";
import {GameStep} from "../../../../../enums/gamestep.enum";
import {GameService} from "../../../../../services/game.service";
import {DeckState} from "../../../../../enums/playing-cards.enum";

@Component({
  selector: 'app-game-area',
  templateUrl: './game-area.component.html',
  styleUrls: ['./game-area.component.less'],
  animations: [
    trigger('card', [
      state('notPulled', style({
        right: 260
      })),
      state('pulled', style({
        right: 0
      })),
      transition('pulled <=> notPulled', [
        animate('150ms')
      ])
    ]),
  ]
})
export class GameAreaComponent implements OnInit {

  @Input() playingCard: PlayingCard;
  @Input() gameAreaForm: FormGroup;

  @Output() doTurnEvent = new EventEmitter<void>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly gameService: GameService
  ) { }

  ngOnInit(): void {
    // this.game.helpString = this.game.currentPlayer.userName + ' zieht eine Karte vom Deck..';
  }

  // doTurn(): void {
  //   this.doTurnEvent.emit();
  //   this.gameAreaForm.get('answer').patchValue('');
  // }
  //
  // pullCard(): void {
  //   if(this.game.currentPlayer.resourceId === this.player.resourceId && this.game.gameStep === GameStep.PULL_CARD) {
  //     this.game.helpString = this.game.currentPlayer.userName + ' deckt die Karte auf.. Sobald die Karte aufgedeckt ist, beginnt die Bombe zu ticken!';
  //     this.game.gameStep = GameStep.TURN_CARD;
  //     this.game.deckState = DeckState.PULLED;
  //     this.gameService.sendGameUpdate(this.game);
  //   }
  // }
}
