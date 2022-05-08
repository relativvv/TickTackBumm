import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {GameService} from "../../../services/game.service";
import {Game} from "../../../models/game.model";
import {GameState} from "../../../enums/gamestate.enum";
import {SocketService} from "../../../services/socket.service";
import {switchMap} from "rxjs/operators";

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
    private readonly gameService: GameService,
    private readonly socketService: SocketService
  ) {
    this.titleService.setTitle('Tick-Tack-Bumm | Spiel');
  }

  ngOnInit(): void {
    this.fetchGame();
  }

  fetchGame(): void {
    this.route.queryParams.pipe(
      switchMap((params: Params) => {
        return this.gameService.getGameByJoinKey(params.key)
      })
    )
      .subscribe((game: Game) => {
      this.game = game;
      this.socketService.getSocket().onmessage = (e) => {
        const json = JSON.parse(e.data);
        if(json.type === 'players') {
          console.log(json.players);
          this.game.players = json.players;
        }
      }
    });

  }

}
