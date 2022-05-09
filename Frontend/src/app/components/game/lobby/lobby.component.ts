import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Clipboard} from "@angular/cdk/clipboard";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Game} from "../../../../models/game.model";
import {combineLatest} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {JoinGameComponent} from "./modals/join-game/join-game.component";
import {SocketService} from "../../../../services/socket.service";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.less']
})
export class LobbyComponent implements OnInit {

  @Input() game: Game;
  form: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly clipboard: Clipboard,
    private readonly toastService: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.createForm();
    if(this.game.players.length >= this.game.maxPlayers) {
      alert('Die Runde ist voll!');
    }
  }

  createForm(): void {
    this.form = this.formBuilder.group({
      allowKnown: [true],
      allowAsked: [true],
      allowOriginal: [true],
      allowShaked: [true],
      allowSetted: [true],
      minBombTime: [10, [Validators.required, Validators.min(1)]],
      maxBombTime: [50, [Validators.required, Validators.max(999)]],
      minPlayers: [3, [Validators.required, Validators.min(3)]],
      maxPlayers: [8, [Validators.required, Validators.max(16)]],
    });

    const minPlayerValueChange$ = this.form.get('minPlayers').valueChanges;
    const maxPlayerValueChanges$ = this.form.get('maxPlayers').valueChanges;

    combineLatest([minPlayerValueChange$, maxPlayerValueChanges$])
      .subscribe(([minP, maxP]) => {
        this.game.minPlayers = minP;
        this.game.maxPlayers = maxP;
      })
  }

  copyLink(): void {
    this.clipboard.copy(window.location.href);
    this.toastService.success('Link kopiert!');
  }

  startGame(): void {

  }

  isFormInvalid(): boolean {
    return this.form.invalid || !this.isBombTimeAllowed() || !this.isPlayerCountAllowed() || this.game.players.length < this.form.get('minPlayers').value;
  }

  private isBombTimeAllowed(): boolean {
    return this.form.get('minBombTime').value < this.form.get('maxBombTime').value;
  }

  private isPlayerCountAllowed(): boolean {
    return this.form.get('minPlayers').value < this.form.get('maxPlayers').value;
  }

}
