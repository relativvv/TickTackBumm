import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {Game} from "../../../models/game.model";
import {Player} from "../../../models/player.model";
import {GameState} from "../../../enums/gamestate.enum";
import {GameService} from "../../../services/game.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {SocketService} from "../../../services/socket.service";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        top: 35,
        opacity: 0
      })),
      transition('void <=> *', [animate(1000)])
    ]),
  ],
})
export class HomeComponent implements OnInit {

  creationForm: FormGroup;
  imageSource: string;
  loading: boolean;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly titleService: Title,
    private readonly gameService: GameService,
    private readonly router: Router,
    private readonly toastService: ToastrService,
    private readonly socketService: SocketService,
    private readonly userService: UserService
  ) {
    this.titleService.setTitle('Tick-Tack-Bumm | Startseite');
  }

  ngOnInit(): void {
    this.createForm();
    this.imageSource = this.userService.getRandomProfileImageString();
  }

  setRandomProfileImage(): void {
    document.getElementById('refresh-profile').setAttribute('disabled', 'true');
    document.getElementById('refresh-profile').classList.add('disabled');

    this.imageSource = this.userService.getRandomProfileImageString();

    setTimeout(() => {
      document.getElementById('refresh-profile').removeAttribute('disabled')
      document.getElementById('refresh-profile').classList.remove('disabled');
    }, 300);
  }

  createGame(): void {
    const creator: Player = {
      userName: this.creationForm.get('username').value,
      image: this.imageSource,
      creator: true
    };

    const game: Game = {
      players: [creator],
      gameState: { id: GameState.LOBBY },
      minPlayers: 3,
      maxPlayers: 16,
      minBombTime: 10,
      maxBombTime: 50,
      allowKnown: true,
      allowAsked: true,
      allowOriginal: true,
      allowSetted: true,
      allowShaked: true,
      enableJoker: true,
      password: this.creationForm.get('setPassword').value ? this.creationForm.get('passwordValue').value : null,
      hasPassword: !!this.creationForm.get('setPassword')
    }

    this.creationForm.get('valid').setValue(false);

    setTimeout(() => {
      this.loading = true;
      this.gameService.createGame(game)
        .subscribe({
          next: (game: Game) => {
            const payload = {
              type: 'createRoom',
              joinKey: game.joinKey,
              player: {
                userName: this.creationForm.get('username').value,
                image: this.imageSource,
                creator: true
              }
            }

            let player: Player = payload.player;
            player.resourceId = this.socketService.playerResourceId;
            this.userService.setPlayer(player);

            this.socketService.getSocket().send(JSON.stringify(payload));
            this.router.navigate(['/game'], { queryParams: { key: game.joinKey } });
          },
          error: () => {
            this.loading = false;
            this.toastService.error('Ein Fehler ist beim Erstellen des Spiels aufgetreten..')
          },
          complete: () => {
            this.loading = false;
          }
        })
    }, 1400)
  }

  socketNotReady(): boolean {
    return this.socketService.getSocket().readyState !== WebSocket.OPEN;
  }

  formInvalid(): boolean {
    return this.creationForm.invalid ||
      !this.creationForm.get('valid').value ||
      this.socketNotReady() ||
      (this.creationForm.get('setPassword').value === true && this.creationForm.get('passwordValue').value.length < 1)
  }

  private createForm(): void {
    this.creationForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(14)]],
      setPassword: [false],
      passwordValue: [{value: '', disabled: true}],
      valid: [true]
    });

    this.creationForm.get('setPassword')
      .valueChanges
      .subscribe((setPassword: boolean) => {
        setPassword === true ? this.creationForm.get('passwordValue').enable() : this.creationForm.get('passwordValue').disable();
      })
  }

}
