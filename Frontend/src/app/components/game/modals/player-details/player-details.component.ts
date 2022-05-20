import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Player} from "../../../../../models/player.model";

interface DialogData {
  player: Player;
}

@Component({
  selector: 'app-player-details',
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.less']
})
export class PlayerDetailsComponent implements OnInit {

  player: Player;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<PlayerDetailsComponent>,
  ) { }

  ngOnInit(): void {
    this.player = this.data.player;
  }

  close(): void {
    this.dialogRef.close();
  }

}
