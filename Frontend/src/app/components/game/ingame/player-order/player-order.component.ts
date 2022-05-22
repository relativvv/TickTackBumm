import {AfterContentInit, Component, Input, OnInit} from '@angular/core';
import {Player} from "../../../../../models/player.model";
import {MatDialog} from "@angular/material/dialog";
import {PlayerDetailsComponent} from "../../modals/player-details/player-details.component";
import {animate, style, transition, trigger} from "@angular/animations";

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
    ]),
  ],
})
export class PlayerOrderComponent implements OnInit, AfterContentInit {

  @Input() players: Player[];

  red: number;
  green: number;
  blue: number;
  textColor: string;

  constructor(
    private readonly matDialogService: MatDialog
  ) { }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    this.textColor = this.getTextColor();
  }

  getRandomColorByName(name: string): string {
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

    this.textColor = this.getTextColor();

    return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
  }

  openPlayerDetails(player: Player) {
    this.matDialogService.open(PlayerDetailsComponent, {
      minWidth: 400,
      data: {
        player: player
      }
    });
  }

  private getTextColor(): string {
    if ((this.red*0.299 + this.green*0.587 + this.blue*0.114) > 186) {
      return '#000000';
    }
    return '#ffffff';
  }

}
