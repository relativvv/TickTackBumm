import {AfterViewChecked, AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {GameService} from "../../../services/game.service";
import {Game} from "../../../models/game.model";
import {GameState} from "../../../enums/gamestate.enum";
import {SocketService} from "../../../services/socket.service";
import {switchMap} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";
import {MatDialog} from "@angular/material/dialog";
import {JoinGameComponent} from "./lobby/modals/join-game/join-game.component";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.less']
})
export class GameComponent implements OnInit, AfterViewInit {

  LOBBY = GameState.LOBBY;
  INGAME = GameState.INGAME;
  END = GameState.END;

  game: Game;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly titleService: Title,
    private readonly gameService: GameService,
    private readonly socketService: SocketService,
    private readonly router: Router,
    private readonly toastrService: ToastrService,
    private readonly matDialogService: MatDialog,
  ) {
    this.titleService.setTitle('Tick-Tack-Bumm | Spiel');
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
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
        const int = setInterval(() => {
          if (this.socketService.getSocket().readyState === WebSocket.OPEN) {
            this.socketService.getSocket().send(JSON.stringify({
              type: 'gameInfos',
              joinKey: this.game.joinKey
            }))

            this.socketService.getSocket().send(JSON.stringify({
              type: 'clientIsInRoom',
              joinKey: this.game.joinKey
            }));
            clearInterval(int);
          }

        }, 500);

        this.socketService.getSocket().onmessage = (e) => {
          const json = JSON.parse(e.data);
          switch(json.type) {
            case 'players':
              this.game.players = json.players;
              break;
            case 'isInRoom':
              if(json.isInRoom === false) {
                if(this.game.gameState.id === GameState.LOBBY) {
                  this.matDialogService.open(JoinGameComponent, {
                    minWidth: 400,
                    disableClose: true,
                    data: {
                      game: this.game
                    }
                  });
                } else {
                  this.router.navigate(['/']);
                  this.toastrService.error('Diese Runde läuft bereits.');
                }
              }
              break;
            case 'triggerEnd':
              if(json.end === true) {
                this.router.navigate(['/']);
                this.toastrService.error('Die Runde ist beendet..')
              }
              break;
          }
        }
    });

  }

}
