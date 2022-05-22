import {Component, Input, OnInit} from '@angular/core';
import {Player} from "../../../../../models/player.model";

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.less'],
})
export class PlayerListComponent implements OnInit {

  @Input() players: Player[];

  constructor() {
  }

  ngOnInit(): void {
  }

}
