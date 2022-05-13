import {Component, Input, OnInit} from '@angular/core';
import {Game} from "../../../../models/game.model";
import {Player} from "../../../../models/player.model";

@Component({
  selector: 'app-ingame',
  templateUrl: './ingame.component.html',
  styleUrls: ['./ingame.component.less']
})
export class IngameComponent implements OnInit {

  @Input() game: Game;
  @Input() player: Player

  constructor() { }

  ngOnInit(): void {
  }

}
