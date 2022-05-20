import {Component, Input, OnInit} from '@angular/core';
import {Player} from "../../../../../../models/player.model";
import {JoinGameComponent} from "../../../lobby/modals/join-game/join-game.component";
import {MatDialog} from "@angular/material/dialog";
import {PlayerDetailsComponent} from "../../../modals/player-details/player-details.component";

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.less']
})
export class MessageItemComponent implements OnInit {

  @Input() player: Player;
  @Input() message: string;

  private red: number;
  private green: number;
  private blue: number;

  textColor: string;
  rgbString: string

  constructor(
    private readonly matDialogService: MatDialog
  ) { }

  ngOnInit(): void {
    this.getRandomColorByName(this.player.userName);
    this.rgbString = 'rgb(' + this.red + ',' + this.green + ',' + this.blue + ')';
    this.textColor = this.getTextColor();
  }

  openPlayerDetails(player: Player) {
    this.matDialogService.open(PlayerDetailsComponent, {
      minWidth: 400,
      data: {
        player: player
      }
    });
  }

  private getRandomColorByName(name: string): void {
    let hash = 0

    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
    }

    let rgb = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      rgb[i] = (hash >> (i * 8)) & 255;
    }

    this.red = rgb[0];
    this.green = rgb[1];
    this.blue = rgb[2];
  }

  private getTextColor(): string {
    if ((this.red*0.299 + this.green*0.587 + this.blue*0.114) > 186) {
      return '#000000';
    }
    return '#ffffff';
  }
}
