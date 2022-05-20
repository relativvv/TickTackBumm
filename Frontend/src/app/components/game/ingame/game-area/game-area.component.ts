import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlayingCard} from "../../../../../models/card.model";
import {Game} from "../../../../../models/game.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {animate, style, transition, trigger} from "@angular/animations";
import {Player} from "../../../../../models/player.model";

@Component({
  selector: 'app-game-area',
  templateUrl: './game-area.component.html',
  styleUrls: ['./game-area.component.less'],
  animations: [
    trigger('card', [
      transition(':enter', [
        style({ right: 220 }),
        animate('400ms', style({ right: 0 }))
      ]),
      transition(':leave', [
        style({ right: 0 }),
        animate('400ms', style({ right: 50 }))
      ]),
    ])
  ]
})
export class GameAreaComponent implements OnInit {

  @Input() playingCard: PlayingCard;
  @Input() game: Game;
  @Input() player: Player;

  form: FormGroup;

  @Output() doTurnEvent = new EventEmitter<void>();

  constructor(
    private readonly formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  doTurn(): void {
    this.doTurnEvent.emit();
    this.form.get('answer').patchValue('');
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      answer: ['', [Validators.required]]
    });
  }

}
