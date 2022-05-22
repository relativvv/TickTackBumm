import {Component, Input, OnInit} from '@angular/core';
import {Game} from "../../../../models/game.model";
import {Player} from "../../../../models/player.model";
import {SocketService} from "../../../../services/socket.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-ingame',
  templateUrl: './ingame.component.html',
  styleUrls: ['./ingame.component.less']
})
export class IngameComponent implements OnInit {

  @Input() game: Game;
  @Input() player: Player

  constructor(
    private readonly socketService: SocketService,
    private readonly router: Router,
    private readonly toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    if(!this.game || !this.player) {
      this.router.navigate(['/']);
      this.toastrService.error('Die Runde ist beendet..')
    }

    this.listenToSocket();
    this.game.currentPlayer = this.game.players[0];
  }

  doTurn(): void {
    const toShift = this.game.players.shift();
    this.game.currentPlayer = null;

    setTimeout(() => {
      this.game.players.push(toShift);
      this.game.currentPlayer = this.game.players[0];
    }, 300)
  }

  private listenToSocket(): void {
    this.socketService.getSocket().onmessage = (e) => {
      const json = JSON.parse(e.data);

      switch(json.type) {

      }
    }
  }

}
