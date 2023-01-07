import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlayingCardState, PlayingCardType} from "../../../../../enums/playing-cards.enum";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Game} from "../../../../../models/game.model";
import {Player} from "../../../../../models/player.model";
import {GameStep} from "../../../../../enums/gamestep.enum";
import {GameService} from "../../../../../services/game.service";
import {AppConfig} from "../../../../../models/appconfig.model";
import {delay, take} from "rxjs/operators";
import {combineLatest} from "rxjs";
import {UserService} from "../../../../../services/user.service";

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

  @Input() cardState: string;

  playingCardType: PlayingCardType;
  value: string;

  constructor(
    private readonly gameService: GameService,
    private readonly userService: UserService
  ) { }

  ngOnInit(): void {
    this.gameService.getGameFromStore()
      .pipe(
        delay(1500)
      )
      .subscribe((gameConfig: AppConfig) => {
        this.playingCardType = gameConfig.game.currentCard.category.id;
        this.value = gameConfig.game.currentCard.value;
    });
  }

  getPlayingCardTypeString(): string {
    switch(this.playingCardType) {
      case PlayingCardType.BEKANNT:
        return "Bekannt";
      case PlayingCardType.GEFRAGT:
        return "Gefragt";
      case PlayingCardType.GESCHUETTELT:
        return "Geschüttelt";
      case PlayingCardType.ANGESETZT:
        return "Angesetzt";
      case PlayingCardType.JOKER:
        return "Joker";
      case PlayingCardType.ORIGINAL:
      default:
        return "Original";
    }
  }

  getToolTip(): string {
    switch(this.playingCardType) {
      case PlayingCardType.BEKANNT:
        return "Nenne eine bekannte Persönlichkeit, dessen Vorname mit einem der beiden Buchstaben beginnt!";
      case PlayingCardType.GEFRAGT:
        return "Beantworte die Frage mit einem Wort";
      case PlayingCardType.GESCHUETTELT:
        return "Finde ein Wort welches sich aus diesem und einem neuen zusammensetzen lässt";
      case PlayingCardType.ANGESETZT:
        return "Finde ein Wort welches sich aus diesem Buchstabensalat bilden lässt. (Es müssen nicht alle Buchstaben verwendet werden)";
      case PlayingCardType.JOKER:
        return "Du kannst die Kategorie frei wählen";
      case PlayingCardType.ORIGINAL:
      default:
        return "...";
    }
  }

  flipCard(): void {
    combineLatest([this.gameService.getGameFromStore().pipe(take(1)), this.userService.getPlayer().pipe(take(1))])
      .subscribe(([gameConfig, playerConfig]: [AppConfig, AppConfig]) => {

        let game = Object.assign({}, gameConfig.game)

        if(game.currentPlayer.resourceId == playerConfig.player.resourceId && game.gameStep === GameStep.TURN_CARD) {
          game.gameStep = GameStep.BOMB_TICKING;
          game.helpString = "Die Bome tickt.. Tick Tack"
          game.cardState = PlayingCardState.OPEN;
          this.gameService.sendGameUpdate(game);
        }
      })
  }
}
