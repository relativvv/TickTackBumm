import {Component, Input, OnInit} from '@angular/core';
import {Player} from "../../../../../../models/player.model";

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.less']
})
export class MessageItemComponent implements OnInit {

  @Input() player: Player;
  @Input() message: string;

  constructor() { }

  ngOnInit(): void {
    this.message = '123456761234567654321234567654321234567654321234567654325432';
    this.player = {
      userName: 'Testexperte',
      image: '../../../../assets/images/profile1.jpg',
      creator: false
    }
  }

}
