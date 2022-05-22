import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlayingCard} from "../../../../../models/card.model";
import {Game} from "../../../../../models/game.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Player} from "../../../../../models/player.model";
import {GameStep} from "../../../../../enums/gamestep.enum";
import {GameService} from "../../../../../services/game.service";

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
  @Input() game: Game;
  @Input() player: Player;

  @Input() deckState: string;
  @Input() playingCardState: string;

  form: FormGroup;

  @Output() doTurnEvent = new EventEmitter<void>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly gameService: GameService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  doTurn(): void {
    this.doTurnEvent.emit();
    this.form.get('answer').patchValue('');
  }

  pullCard(): void {
    if(this.game.currentPlayer.resourceId === this.player.resourceId && this.game.gameStep === GameStep.PULL_CARD) {
      this.deckState = 'pulled';
      this.game.gameStep = GameStep.TURN_CARD;
      this.gameService.sendGameUpdate(this.game);
    }
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      answer: [{value: '', disabled: this.game.currentPlayer.resourceId != this.player.resourceId}, [Validators.required]]
    });
  }

}
