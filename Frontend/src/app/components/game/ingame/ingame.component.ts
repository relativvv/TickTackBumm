import {Component, Input, OnInit} from '@angular/core';
import {Game, Message} from "../../../../models/game.model";
import {Player} from "../../../../models/player.model";
import {SocketService} from "../../../../services/socket.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {GameService} from "../../../../services/game.service";
import {FormGroup} from "@angular/forms";
import {combineLatest} from "rxjs";
import {UserService} from "../../../../services/user.service";

@Component({
  selector: 'app-ingame',
  templateUrl: './ingame.component.html',
  styleUrls: ['./ingame.component.less']
})
export class IngameComponent implements OnInit {

  @Input() messages: Message[] = [];
  @Input() gameAreaForm: FormGroup;

  constructor(
    private readonly socketService: SocketService,
    private readonly router: Router,
    private readonly toastrService: ToastrService,
    private readonly gameService: GameService,
    private readonly userService: UserService
  ) { }

  ngOnInit(): void {
    combineLatest([this.gameService.getGameFromStore(), this.userService])
    if(!this.game || !this.player) {
      this.router.navigate(['/']);
      this.toastrService.error('Die Runde ist beendet..')
    }

    this.game.currentPlayer = this.game.players[0];
  }

  doTurn(): void {
    this.gameService.doTurn(this.game);
  }
}
