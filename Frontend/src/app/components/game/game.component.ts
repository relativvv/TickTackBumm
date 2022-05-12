import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {GameService} from "../../../services/game.service";
import {Game} from "../../../models/game.model";
import {GameState} from "../../../enums/gamestate.enum";
import {SocketService} from "../../../services/socket.service";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";
import {MatDialog} from "@angular/material/dialog";
import {JoinGameComponent} from "./lobby/modals/join-game/join-game.component";
import {NEVER} from "rxjs";
import {UserService} from "../../../services/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {selectPlayer} from "../../../core/store/player/player.selectors";
import {Player} from "../../../models/player.model";
import {Store} from "@ngrx/store";
import {AppConfig} from "../../../models/appconfig.model";

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
  lobbyForm: FormGroup
  player: Player;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly titleService: Title,
    private readonly gameService: GameService,
    private readonly socketService: SocketService,
    private readonly router: Router,
    private readonly toastrService: ToastrService,
    private readonly matDialogService: MatDialog,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppConfig>,
    private readonly userService: UserService
  ) {
    this.titleService.setTitle('Tick-Tack-Bumm | Spiel');
  }

  ngOnInit(): void {
    this.getPlayer();
    this.createForm();
  }

  ngAfterViewInit() {
    this.fetchGame();
  }

  private fetchGame(): void {
    this.route.queryParams.pipe(
      switchMap((params: Params) => {
        if(!params.key) {
          this.router.navigate(['/']);
          return NEVER;
        }

        return this.gameService.getGameByJoinKey(params.key);
      })
    ).subscribe((game: Game) => {
      this.game = game;

      const int = setInterval(() => {
        if (this.socketService.getSocket().readyState === WebSocket.OPEN) {
          this.startListening();

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
    });
  }

  private startListening(): void {
    this.socketService.getSocket().onmessage = (e) => {
      const json = JSON.parse(e.data);
      switch(json.type) {
        case 'updateSettings':
          this.lobbyForm.setValue(json.values);
          break;

        case 'players':
          this.game.players = json.players;
          if(this.player) {
            const p = this.game.players.find((player: Player) => player.resourceId == this.player.resourceId)
            if(p) {
              let copy = Object.assign({}, this.player);
              copy.creator = p.creator;
              this.userService.setPlayer(copy);
              this.getPlayer();
              if(this.userService.hasPermission(this.player)) {
                this.lobbyForm.enable();
              }
            }
          }
          break;

        case 'isInRoom':
          if(json.isInRoom === false) {
            if(this.game.players.length > 0 && this.game.players.length < this.game.maxPlayers) {
              if(this.game.gameState.id === GameState.LOBBY) {
                return this.matDialogService.open(JoinGameComponent, {
                  minWidth: 400,
                  disableClose: true,
                  data: {
                    game: this.game
                  }
                }).afterClosed()
                  .pipe(
                    switchMap(() => {
                      return this.store.select(selectPlayer);
                    })
                  ).subscribe((appConfig: AppConfig) => {
                    this.player = appConfig.player;
                  });
              } else {
                this.router.navigate(['/']);
                this.toastrService.error('Diese Runde läuft bereits.');
              }
            } else {
              this.router.navigate(['/']);
              this.toastrService.error('Diese Runde existiert nicht.');
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

      return null;
    }
  }

  private createForm(): void {
    this.lobbyForm = this.formBuilder.group({
      allowKnown: [{value: true}],
      allowAsked: [{value: true}],
      allowOriginal: [{value: true}],
      allowShaked: [{value: true}],
      allowSetted: [{value: true}],
      enableJoker: [{value: true}],
      minBombTime: [10, [Validators.required, Validators.min(1)]],
      maxBombTime: [50, [Validators.required, Validators.max(999)]],
      minPlayers: [3, [Validators.required, Validators.min(3)]],
      maxPlayers: [8, [Validators.required, Validators.max(16)]],
    });

    if(!this.userService.hasPermission(this.player)) {
      this.lobbyForm.disable();
    }

    this.lobbyForm.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe(() => {
        //DB Update
        console.log('db update && 200 ms disablen')
        this.socketService.getSocket().send(JSON.stringify({
          type: 'updateGame',
          joinKey: this.game.joinKey,
          values: {
            allowKnown: this.lobbyForm.get('allowKnown').value,
            allowAsked: this.lobbyForm.get('allowAsked').value,
            allowOriginal: this.lobbyForm.get('allowOriginal').value,
            allowShaked: this.lobbyForm.get('allowShaked').value,
            allowSetted: this.lobbyForm.get('allowSetted').value,
            minBombTime: this.lobbyForm.get('minBombTime').value,
            maxBombTime: this.lobbyForm.get('maxBombTime').value,
            minPlayers: this.lobbyForm.get('minPlayers').value,
            maxPlayers: this.lobbyForm.get('maxPlayers').value,
            enableJoker: this.lobbyForm.get('enableJoker').value
          }
        }))
      })
  }

  private getPlayer(): void {
    this.store.select(selectPlayer)
      .subscribe((appConfig: AppConfig) => {
        if(appConfig) {
          this.player = appConfig.player;
        }
      })
  }
}
