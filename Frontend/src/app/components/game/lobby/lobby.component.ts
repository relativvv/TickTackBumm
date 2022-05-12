import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Clipboard} from "@angular/cdk/clipboard";
import {ToastrService} from "ngx-toastr";
import {Game} from "../../../../models/game.model";
import {Player} from "../../../../models/player.model";
import {UserService} from "../../../../services/user.service";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.less']
})
export class LobbyComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() game: Game;
  @Input() player: Player;


  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly clipboard: Clipboard,
    private readonly toastService: ToastrService,
    private readonly userService: UserService
  ) {
  }

  ngOnInit(): void {
    if(this.game.players.length >= this.game.maxPlayers) {
      return;
    }

    if(this.game.players.length === 0) {
      return;
    }
  }

  copyLink(): void {
    this.clipboard.copy(window.location.href);
    this.toastService.success('Link kopiert!');
  }

  startGame(): void {

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
