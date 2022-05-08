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
    trigger('fadeOut', [
      state('false', style({
        opacity: 0
      })),
      transition('* => false', [animate(1000)])
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
    private readonly toastService: ToastrService
  ) {
    this.titleService.setTitle('Tick-Tack-Bumm | Startseite');
  }

  ngOnInit(): void {
    this.createForm();
    this.imageSource = HomeComponent.getRandomProfileImageString();
  }

  setRandomProfileImage(): void {
    document.getElementById('refresh-profile').setAttribute('disabled', 'true');
    document.getElementById('refresh-profile').classList.add('disabled');

    this.imageSource = HomeComponent.getRandomProfileImageString();

    setTimeout(() => {
      document.getElementById('refresh-profile').removeAttribute('disabled')
      document.getElementById('refresh-profile').classList.remove('disabled');
    }, 1000);
  }

  private static getRandomProfileImageString() {
    const profileImages = [
      "../../../../assets/images/profile1.jpg",
      "../../../../assets/images/profile2.jpg",
      "../../../../assets/images/profile3.jpg",
      "../../../../assets/images/profile4.png",
      "../../../../assets/images/profile5.jpg",
      "../../../../assets/images/profile6.jpg",
      "../../../../assets/images/profile7.PNG",
      "../../../../assets/images/profile8.jpg",
      "../../../../assets/images/profile9.jpg",
    ]

    const rnd = Math.floor(Math.random() * 9);
    return profileImages[rnd];
  }

  createGame(): void {
    const creator: Player = {
      userName: this.creationForm.get('username').value,
      image: this.imageSource,
      creator: true
    };

    const game: Game = {
      id: null,
      joinKey: null,
      players: [creator],
      gameState: GameState.LOBBY,
      minPlayers: 3,
      maxPlayers: 16,
      minBombTime: 10,
      maxBombTime: 50,
      allowKnown: true,
      allowAsked: true,
      allowOriginal: true,
      allowSetted: true,
      allowShaked: true,
    }

    this.creationForm.get('valid').setValue(false);

    setTimeout(() => {
      this.loading = true;
      this.gameService.createGame(game)
        .subscribe({
          next: (game: Game) => {
            this.router.navigate(['/game', { key: game.joinKey }]);
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

  private createForm(): void {
    this.creationForm = this.formBuilder.group({
      username: ['', [Validators.required]],
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
