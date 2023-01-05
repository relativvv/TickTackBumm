import {AfterContentInit, Component, Input, OnInit} from '@angular/core';
import {Player} from "../../../../../models/player.model";
import {MatDialog} from "@angular/material/dialog";
import {PlayerDetailsComponent} from "../../modals/player-details/player-details.component";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Memoize} from "typescript-memoize";
import {Game} from "../../../../../models/game.model";

@Component({
  selector: 'app-player-order',
  templateUrl: './player-order.component.html',
  styleUrls: ['./player-order.component.less'],
  animations: [
    trigger('fadeWhole', [
      transition(':enter', [
        style({ top: 15, opacity: 0 }),
        animate('300ms', style({ opacity: 1, top: 0 }))
      ]),
      transition(':leave', [
        style({ top: 0, opacity: 1 }),
        animate('300ms', style({ opacity: 0, top: 15 }))
      ]),
    ])
  ],
})
export class PlayerOrderComponent implements OnInit {

  constructor(
    private readonly matDialogService: MatDialog
  ) { }

  ngOnInit(): void {
  }

  getRandomColorByName(name: string): string {
    const rgb = PlayerOrderComponent.getRGBByName(name);
    return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
  }

  openPlayerDetails(player: Player) {
    console.log(player);
    this.matDialogService.open(PlayerDetailsComponent, {
      minWidth: 400,
      data: {
        player: player
      }
    });
  }

  getTextColor(name: string): string {
    const rgb = PlayerOrderComponent.getRGBByName(name);

    if ((rgb[0]*0.299 + rgb[1]*0.587 + rgb[2]*0.114) > 186) {
      return '#000000';
    }
    return '#ffffff';
  }

  private static getRGBByName(name: string): number[] {
    let hash = 0

    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
    }

    let rgb = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      rgb[i] = (hash >> (i * 8)) & 255;
    }

    return [rgb[0], rgb[1], rgb[2]];
  }

}
