import {Component, Input, OnInit} from '@angular/core';
import {Player} from "../../../../../../models/player.model";

@Component({
  selector: 'app-player-item',
  templateUrl: './player-item.component.html',
  styleUrls: ['./player-item.component.less']
})
export class PlayerItemComponent implements OnInit {

  @Input() player: Player;

  constructor() { }

  ngOnInit(): void {
  }

}
