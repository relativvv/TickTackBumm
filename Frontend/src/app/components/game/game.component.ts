import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {GameService} from "../../../services/game.service";
import {Game} from "../../../models/game.model";
import {GameState} from "../../../enums/gamestate.enum";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.less']
})
export class GameComponent implements OnInit {

  LOBBY = GameState.LOBBY;
  INGAME = GameState.INGAME;
  END = GameState.END;

  game: Game;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly titleService: Title,
    private readonly gameService: GameService
  ) {
    this.titleService.setTitle('Tick-Tack-Bumm | Spiel');
  }

  ngOnInit(): void {
  }

  fetchGame(): void {
    const joinKey = this.route.snapshot.paramMap.get('joinKey');
    this.gameService.getGameByJoinKey(joinKey)
      .subscribe((game: Game) => {
        this.game = game;
      });
  }

}
