import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {GameService} from "../../../services/game.service";
import {Game, Message} from "../../../models/game.model";
import {GameState} from "../../../enums/gamestate.enum";
import {SocketService} from "../../../services/socket.service";
import {debounceTime, delay, distinctUntilChanged, switchMap, take} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";
import {MatDialog} from "@angular/material/dialog";
import {JoinGameComponent} from "./lobby/modals/join-game/join-game.component";
import {combineLatest, EMPTY, NEVER, of} from "rxjs";
import {UserService} from "../../../services/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Player} from "../../../models/player.model";
import {AppConfig} from "../../../models/appconfig.model";
import {GameStep} from "../../../enums/gamestep.enum";
import {DeckState, PlayingCardState} from "../../../enums/playing-cards.enum";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.less']
})
export class GameComponent implements OnInit, AfterViewInit {

  startTriggered: boolean = false;
  timer: number = 3;
  singleState = 'notStarted';
  removeComponent = false;

  LOBBY = GameState.LOBBY;
  INGAME = GameState.INGAME;
  END = GameState.END;

  lobbyForm: FormGroup
  gameAreaForm: FormGroup;

  messages = [];

  bombInterval: any;
  isBombTicking: boolean;

  game: Game;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly titleService: Title,
    private readonly gameService: GameService,
    private readonly socketService: SocketService,
    private readonly router: Router,
    private readonly toastrService: ToastrService,
    private readonly matDialogService: MatDialog,
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService
  ) {
    this.titleService.setTitle('Tick-Tack-Bumm | Spiel');
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.fetchGame();
  }

  startGame(): void {
    if(!this.startTriggered) {
      this.startTriggered = true;
      this.timer = 3;

      this.gameService.getGameFromStore()
        .pipe(
          take(1)
        )
        .subscribe((appConfig: AppConfig) => {
          this.socketService.getSocket().send(JSON.stringify({
            type: 'startCountdown',
            joinKey: appConfig.game.joinKey
          }));
        })

      const timerInt = setInterval(() => {
        this.timer--;

        if (this.timer === 0) {
          this.singleState = 'notStarted';
          this.removeComponent = true;
          setTimeout(() => {
            combineLatest([this.gameService.getGameFromStore(), this.userService.getPlayer()])
              .pipe(
                take(1),
                switchMap(([gameConfig, playerConfig]) => {
                  let copy = Object.assign({}, gameConfig.game);
                  copy.gameState = {
                    id: GameState.INGAME,
                    name: 'ingame'
                  };
                  copy.gameStep = GameStep.PULL_CARD;
                  copy.cardState = PlayingCardState.HIDDEN;
                  copy.deckState = DeckState.NOT_PULLED;
                  copy.round = 1;
                  copy.currentPlayer = copy.players[0];
                  copy.helpString = copy.currentPlayer.userName + ' zieht eine Karte vom Deck..'
                  this.game = copy;
                  this.gameService.setGame(copy);
                  this.gameService.sendGameUpdate(copy);

                  return combineLatest([this.gameService.updateGame(copy.id, copy), of(playerConfig.player.resourceId)]);
                })
              )
              .pipe(
                switchMap(([dbGame, resourceId]: [Game, string]) => combineLatest([this.gameService.getGameFromStore().pipe(take(1)), of(resourceId)]))
              )
              .subscribe(([gameConfig, resourceId]: [AppConfig, string]) => {
                this.gameService.renewGameCardAndUpdate(gameConfig.game);
                if(gameConfig.game.currentPlayer.resourceId === resourceId) {
                  this.gameAreaForm.enable();
                } else {
                  this.gameAreaForm.disable();
                }
                clearInterval(timerInt);
              });
            }, 500)
        }
      }, 1000);
    }
  }

  private externalStart(): void {
    if(!this.startTriggered) {
      this.startTriggered = true;
      this.timer = 3;

      const timerInt = setInterval(() => {
        this.timer--;

        if (this.timer === 0) {
          this.singleState = 'notStarted';
          this.removeComponent = true;

          setTimeout(() => {
            this.gameService.getGameFromStore()
              .pipe(
                take(1)
              )
              .subscribe((appConfig: AppConfig) => {
                let copy = Object.assign({}, appConfig.game);
                const gameState = {
                  id: GameState.INGAME,
                  name: 'ingame'
                }
                copy.gameState = gameState;
                copy.gameStep = GameStep.PULL_CARD;
                copy.round = 1;
                this.game = copy;
                this.gameService.setGame(copy);
              })

            clearInterval(timerInt);
          }, 500)
        }
      }, 1000);
    }
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
      game.players = [];
      game.currentPlayer = null;
      game.gameStep = GameStep.PULL_CARD;
      this.game = game;
      this.gameService.setGame(game);

      const int = setInterval(() => {
        if (this.socketService.getSocket().readyState === WebSocket.OPEN) {
          this.startListening();

          this.socketService.getSocket().send(JSON.stringify({
            type: 'gameInfos',
            joinKey: game.joinKey
          }))

          this.socketService.getSocket().send(JSON.stringify({
            type: 'clientIsInRoom',
            joinKey: game.joinKey
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
        case 'players':
          combineLatest([this.gameService.getGameFromStore(), this.userService.getPlayer()])
            .pipe(
              take(1)
            )
            .subscribe(([gameConfig, playerConfig]) => {

              let copy = Object.assign({}, gameConfig.game);
              copy.players = json.players;
              this.game = copy;
              this.gameService.setGame(copy);

              if(playerConfig && gameConfig) {
                if(playerConfig.player && gameConfig.game.gameState.id == GameState.LOBBY) {
                  const p = copy.players.find((player: Player) => player.resourceId == playerConfig.player.resourceId)
                  if(p) {
                    let copy = Object.assign({}, playerConfig.player);
                    copy.creator = p.creator;
                    this.userService.setPlayer(copy);

                    if(this.userService.hasPermission(copy)) {
                      if(this.lobbyForm) {
                        this.lobbyForm.enable();
                      }
                    }
                  }
                }
              }
            })
          break;

        case 'isInRoom':
          if(json.isInRoom === false) {
            this.gameService.getGameFromStore()
              .pipe(
                take(1),
                switchMap((appConfig: AppConfig) => {
                  if(appConfig.game.players.length === 0) {
                    this.router.navigate(['/']);
                    this.toastrService.error('Diese Runde existiert nicht.');
                    return NEVER;
                  }

                  if(appConfig.game.gameState.id !== GameState.LOBBY) {
                    this.router.navigate(['/']);
                    this.toastrService.error('Diese Runde läuft bereits.');
                    return NEVER;
                  }

                  this.createForm();

                  return this.matDialogService.open(JoinGameComponent, {
                    minWidth: 400,
                    disableClose: true,
                    data: {
                      game: appConfig.game
                    }
                  }).afterClosed()
                    .pipe(
                      switchMap(() => {
                        this.lookForChanges();
                        this.lobbyForm.disable();
                        return this.gameService.getGameFromStore().pipe(take(1));
                      })
                    )
                })
              ).subscribe((appConfig: AppConfig) => {
                this.updateLobbyForm(appConfig.game);
                this.game = appConfig.game;
            })
            return;
          }

          this.createForm();
          this.lookForChanges();
          this.gameService.getGameFromStore()
            .pipe(
              take(1)
            )
            .subscribe((appConfig: AppConfig) => {
              this.game = appConfig.game;
            })
          break;

        case 'triggerEnd':
          if(json.end === true) {
            this.router.navigate(['/']);
            this.toastrService.error('Die Runde ist beendet..')
          }
          break;

        case 'receiveMessage':
          const messageItem: Message = {
            message: json.message,
            sender: json.player
          }
          this.messages.push(messageItem);
          break;

        case 'updateGame':
          let updatedGame = json.game;

          combineLatest([this.gameService.getGameFromStore().pipe(take(1)), this.userService.getPlayer().pipe(take(1))])
            .subscribe(([gameConfig, playerConfig]) => {
              let copy = Object.assign({}, gameConfig.game);

              if(updatedGame.gameStep !== copy.gameStep) {
                if(copy.gameStep === GameStep.PULL_CARD) {
                  updatedGame.deckState = DeckState.PULLED;
                } else if(copy.gameStep === GameStep.TURN_CARD) {
                  updatedGame.cardState = PlayingCardState.OPEN;
                }
              }

              if(updatedGame.gameState.id === GameState.INGAME) {
                if(updatedGame.gameStep === GameStep.BOMB_TICKING && updatedGame.gameStep !== gameConfig.game.gameStep && !this.isBombTicking) {
                  // Start bomb
                  this.isBombTicking = true;

                  this.socketService.getSocket().send(JSON.stringify({
                    type: 'startBomb',
                    joinKey: updatedGame.joinKey,
                    minBombTime: updatedGame.minBombTime,
                    maxBombTime: updatedGame.maxBombTime,
                  }))
                }

                if(updatedGame.currentPlayer.resourceId === playerConfig.player.resourceId && updatedGame.gameStep === GameStep.BOMB_TICKING) {
                  this.gameAreaForm.enable();
                } else {
                  this.gameAreaForm.disable();
                }
              } else if(updatedGame.gameState.id === GameState.LOBBY) {
                this.updateLobbyForm(updatedGame);
              }

              this.game = updatedGame;
              this.gameService.setGame(updatedGame);
            })
          break;

        case 'countdownStarted':
          this.externalStart();
          break;

        case 'bombStarted':
          this.startBomb(json.timer);
          break;

        case 'bombExploded':
          const updatedG = json.game;
          this.isBombTicking = false;
          updatedG.deckState = DeckState.NOT_PULLED;
          updatedG.cardState = PlayingCardState.HIDDEN;

          this.gameService.setGame(updatedG);


          setTimeout(() => {
            const clone = Object.assign({}, updatedG);
            clone.gameStep = GameStep.PULL_CARD;
            this.gameService.setGame(clone);
            this.gameService.sendGameUpdate(clone);
          }, 2000);
          break;
      }

      return null;
    }
  }

  private startBomb(time: number): void {
    this.bombInterval = setInterval(() => {
      time--;

      if(time === 0) {
        combineLatest([this.gameService.getGameFromStore(), this.userService.getPlayer()])
          .pipe(
            take(1)
          )
          .subscribe(([gameConfig, playerConfig]) => {
            if(gameConfig.game.currentPlayer.resourceId === playerConfig.player.resourceId) {
              this.socketService.getSocket().send(JSON.stringify({
                type: 'explodeBomb',
                joinKey: gameConfig.game.joinKey,
                game: gameConfig.game
              }));
            }

            clearInterval(this.bombInterval);
          })
      }
    }, 1000)
  }

  private createForm(): void {
    this.gameAreaForm = this.formBuilder.group({
      answer: [{value: '', disabled: true}, [Validators.required]]
    });

    this.lobbyForm = this.formBuilder.group({
      allowKnown: [true, { updateOn: 'change' }],
      allowAsked: [true, { updateOn: 'change' }],
      allowOriginal: [true, { updateOn: 'change' }],
      allowShaked: [true, { updateOn: 'change' }],
      allowSetted: [true, { updateOn: 'change' }],
      enableJoker: [true, { updateOn: 'change' }],
      minBombTime: [10, {validators: [Validators.required, Validators.min(1)], updateOn: 'change'}],
      maxBombTime: [50, {validators: [Validators.required, Validators.max(999)], updateOn: 'change'}],
      minPlayers: [1, {validators: [Validators.required, Validators.min(1)], updateOn: 'change'}],
      maxPlayers: [8, {validators: [Validators.required, Validators.max(16)], updateOn: 'change'}],
    });
  }

  private lookForChanges() {
    this.lobbyForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((next: Game) => {
          return combineLatest([this.gameService.getGameFromStore(), this.userService.getPlayer()])
            .pipe(
              take(1),
              switchMap(([gameConfig, playerConfig]: [AppConfig, AppConfig]) => {
                if(playerConfig.player.resourceId === gameConfig.game.players[0].resourceId) {
                  let copy = Object.assign({}, gameConfig.game);
                  this.game = copy;
                  GameComponent.setGameValues(copy, next)
                  this.gameService.setGame(copy);
                  this.gameService.sendGameUpdate(copy);
                  return this.gameService.updateGame(copy.id, copy);
                }
                return EMPTY;
              })
            )
        })
      )
      .subscribe()
  }

  private static setGameValues(oldGame: Game, newGame: Game): void {
    oldGame.allowKnown = newGame.allowKnown;
    oldGame.allowAsked = newGame.allowAsked;
    oldGame.allowOriginal = newGame.allowOriginal;
    oldGame.allowShaked = newGame.allowShaked;
    oldGame.minBombTime = newGame.minBombTime;
    oldGame.maxBombTime = newGame.maxBombTime;
    oldGame.allowSetted = newGame.allowSetted;
    oldGame.minPlayers = newGame.minPlayers;
    oldGame.maxPlayers = newGame.maxPlayers;
    oldGame.enableJoker = newGame.enableJoker;
  }

  private updateLobbyForm(game: Game) {
    this.lobbyForm.get('allowKnown').setValue(game.allowKnown, { emitEvent: false });
    this.lobbyForm.get('allowAsked').setValue(game.allowAsked, { emitEvent: false });
    this.lobbyForm.get('allowOriginal').setValue(game.allowOriginal, { emitEvent: false });
    this.lobbyForm.get('allowShaked').setValue(game.allowShaked, { emitEvent: false });
    this.lobbyForm.get('allowSetted').setValue(game.allowSetted, { emitEvent: false });
    this.lobbyForm.get('minBombTime').setValue(game.minBombTime, { emitEvent: false });
    this.lobbyForm.get('maxBombTime').setValue(game.maxBombTime, { emitEvent: false });
    this.lobbyForm.get('minPlayers').setValue(game.minPlayers, { emitEvent: false });
    this.lobbyForm.get('maxPlayers').setValue(game.maxPlayers, { emitEvent: false });
    this.lobbyForm.get('enableJoker').setValue(game.enableJoker, { emitEvent: false });
  }
}
