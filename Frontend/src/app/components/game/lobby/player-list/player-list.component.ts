import {Component, Input, OnInit} from '@angular/core';
import {Player} from "../../../../../models/player.model";

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.less']
})
export class PlayerListComponent implements OnInit {

  @Input() players: Player[];

  constructor() {
    this.players = []
    this.players.push({
      userName: 'Testnutzer',
      image: '../../assets/images/profile1.jpg',
      creator: false
    })
    this.players.push({
      userName: 'Testnutzer',
      image: '../../assets/images/profile1.jpg',
      creator: true
    })
    this.players.push({
      userName: 'Testnutzer',
      image: '../../assets/images/profile1.jpg',
      creator: false
    })
    this.players.push({
      userName: 'Testnutzer',
      image: '../../assets/images/profile1.jpg',
      creator: false
    })
  }

  ngOnInit(): void {
  }

}
