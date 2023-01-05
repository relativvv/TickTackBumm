import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Clipboard} from "@angular/cdk/clipboard";
import {ToastrService} from "ngx-toastr";
import {Game} from "../../../../models/game.model";
import {Player} from "../../../../models/player.model";
import {UserService} from "../../../../services/user.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {GameState} from "../../../../enums/gamestate.enum";
import {GameService} from "../../../../services/game.service";
import {GameStep} from "../../../../enums/gamestep.enum";
import {SocketService} from "../../../../services/socket.service";
import {AppConfig} from "../../../../models/appconfig.model";
import {combineLatest} from "rxjs";
import {take, takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.less'],
  animations: [
    trigger('fadeWhole', [
      transition(':enter', [
        style({ top: 35, opacity: 0 }),
        animate('500ms', style({ opacity: 1, top: 0 }))
      ]),
      transition(':leave', [
        style({ top: 0, opacity: 1 }),
        animate('500ms', style({ opacity: 0, top: 100 }))
      ]),
    ]),
    trigger('fadeSingle', [
      state('notStarted', style({
        opacity: 0
      })),
      state('start', style({
        opacity: 1
      })),
      transition('notStarted <=> start', [
        animate('400ms')
      ])
    ]),
  ],
})
export class LobbyComponent implements OnInit {

  @Input() form: FormGroup;

  @Input() startTriggered: boolean;
  @Input() timer: number;
  @Input() singleState: string;
  @Input() removeComponent: boolean;

  @Output() gameStarter = new EventEmitter<void>();

  game: Game;
  player: Player;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly clipboard: Clipboard,
    private readonly toastService: ToastrService,
    private readonly userService: UserService,
    private readonly gameService: GameService
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.singleState = 'start';
    }, 200);

    combineLatest([this.gameService.getGameFromStore(), this.userService.getPlayer()])
      .pipe(
        takeUntil(this.gameStarter.asObservable())
      )
      .subscribe(([gameConfig, playerConfig]: [AppConfig, AppConfig]) => {
        this.game = gameConfig ? gameConfig.game : null;
        this.player = playerConfig ? playerConfig.player : null
      })
  }

  copyLink(): void {
    this.clipboard.copy(window.location.href);
    this.toastService.success('Link kopiert!');
  }

  startGame(): void {
    this.gameStarter.emit();
  }

  isFormInvalid(): boolean {
    return this.form.invalid || !this.isBombTimeAllowed() || !this.isPlayerCountAllowed() || this.game.players.length < this.form.get('minPlayers').value || !this.userService.hasPermission(this.player);
  }

  private isBombTimeAllowed(): boolean {
    return this.form.get('minBombTime').value < this.form.get('maxBombTime').value;
  }

  private isPlayerCountAllowed(): boolean {
    return this.form.get('minPlayers').value < this.form.get('maxPlayers').value;
  }
}
