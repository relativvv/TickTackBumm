import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlayingCard} from "../../../../../models/card.model";
import {Game} from "../../../../../models/game.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {GameStep} from "../../../../../enums/gamestep.enum";
import {GameService} from "../../../../../services/game.service";
import {DeckState} from "../../../../../enums/playing-cards.enum";
import {AppConfig} from "../../../../../models/appconfig.model";
import {UserService} from "../../../../../services/user.service";
import {Player} from "../../../../../models/player.model";
import {combineLatest} from "rxjs";
import {take} from "rxjs/operators";

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

  game: Game;
  player: Player;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly gameService: GameService,
    private readonly userService: UserService
  ) { }

  ngOnInit(): void {
    combineLatest([this.gameService.getGameFromStore(), this.userService.getPlayer()])
      .subscribe(([gameConfig, playerConfig]: [AppConfig, AppConfig]) => {
        this.game = gameConfig.game;
        this.player = playerConfig.player;
        console.log(this.player);
      })
  }

  doTurn(): void {
    this.doTurnEvent.emit();
    this.gameAreaForm.get('answer').patchValue('');
  }

  pullCard(): void {
    combineLatest([this.gameService.getGameFromStore().pipe(take(1)), this.userService.getPlayer().pipe(take(1))])
      .subscribe(([gameConfig, playerConfig]: [AppConfig, AppConfig]) => {

        let game = Object.assign({}, gameConfig.game);

        if(gameConfig.game.currentPlayer.resourceId === playerConfig.player.resourceId && gameConfig.game.gameStep === GameStep.PULL_CARD) {
          game.helpString = gameConfig.game.currentPlayer.userName + ' deckt die Karte auf.. Sobald die Karte aufgedeckt ist, beginnt die Bombe zu ticken!';
          game.gameStep = GameStep.TURN_CARD;
          game.deckState = DeckState.PULLED;
          this.gameService.sendGameUpdate(game);
        }
      })

  }
}
