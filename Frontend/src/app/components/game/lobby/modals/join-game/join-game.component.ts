import {AfterContentInit, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../../../../services/user.service";
import {Game} from "../../../../../../models/game.model";
import {GameService} from "../../../../../../services/game.service";
import {catchError} from "rxjs/operators";
import {NEVER} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {SocketService} from "../../../../../../services/socket.service";

interface DialogData {
  game: Game;
}

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.less']
})
export class JoinGameComponent implements OnInit {

  form: FormGroup
  imageSource: string;
  game: Game;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<JoinGameComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly gameService: GameService,
    private readonly toastService: ToastrService,
    private readonly socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.game = this.data.game;
    this.imageSource = this.userService.getRandomProfileImageString();
    this.createForm();
  }

  close(): void {
    this.dialogRef.close();
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

  joinRound(): void {
    if(this.form.get('username').value.length < 1) {
      this.toastService.error('Du musst einen Nutzernamen angeben!');
      return;
    }

    if(this.game.hasPassword) {
      const pw = this.form.get('password').value;
      this.gameService.verifyPassword(this.game.joinKey, pw)
        .pipe(
          catchError(() => {
            this.toastService.error('Das Passwort ist falsch!')
            return NEVER;
          })
        )
        .subscribe(() => {
          this.socketService.getSocket().send(JSON.stringify({
            type: 'joinRoom',
            key: this.game.joinKey,
            userName: this.form.get('username').value,
            image: this.imageSource
          }));
          this.close();
        })
      return;
    }

      this.socketService.getSocket().send(JSON.stringify({
        type: 'joinRoom',
        joinKey: this.game.joinKey,
        player: {
          userName: this.form.get('username').value,
          image: this.imageSource
        },
      }))
      this.close();
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      username: [null, [Validators.required, Validators.maxLength(14)]],
    });

    if(this.game.hasPassword) {
      this.form.addControl('password', new FormControl(null, Validators.required));
    }
  }
}
