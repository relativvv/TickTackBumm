import {Component, OnInit} from '@angular/core';
import {Player} from "../../../../../models/player.model";
import {GameService} from "../../../../../services/game.service";
import {AppConfig} from "../../../../../models/appconfig.model";

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.less'],
})
export class PlayerListComponent implements OnInit {

  players: Player[];

  constructor(
    private readonly gameService: GameService
  ) {
  }

  ngOnInit(): void {
    this.gameService.getGameFromStore()
      .subscribe((appConfig: AppConfig) => {
        this.players = appConfig.game.players;
      })
  }

}
