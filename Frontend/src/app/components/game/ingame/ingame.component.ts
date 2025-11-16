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
import {AppConfig} from "../../../../models/appconfig.model";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-ingame',
  templateUrl: './ingame.component.html',
  styleUrls: ['./ingame.component.less']
})
export class IngameComponent implements OnInit {

  @Input() messages: Message[] = [];
  @Input() gameAreaForm: FormGroup;

  constructor(
    private readonly gameService: GameService,
  ) {
  }

  ngOnInit(): void {
  }

  doTurn(): void {
    this.gameService.getGameFromStore()
      .pipe(
        take(1)
      )
      .subscribe((gameConfig: AppConfig) => {
        this.gameService.doTurn(gameConfig.game);
      });
  }
}
