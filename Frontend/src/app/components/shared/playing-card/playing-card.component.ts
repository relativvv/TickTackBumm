import {Component, Input, OnInit} from '@angular/core';
import {PlayingCardType} from "../../../../enums/playing-cards.enum";

@Component({
  selector: 'app-playing-card',
  templateUrl: './playing-card.component.html',
  styleUrls: ['./playing-card.component.less']
})
export class PlayingCardComponent implements OnInit {

  @Input() playingCardType: PlayingCardType = PlayingCardType.ORIGINAL;

  constructor() { }

  ngOnInit(): void {
  }

  private getPlayingCardTypeString() {
    switch(this.playingCardType) {
      case PlayingCardType.BEKANNT:
        return "Bekannt";
      case PlayingCardType.GEFRAGT:
        return "Gefragt";
      case PlayingCardType.GESCHUETTELT:
        return "Geschüttelt";
      case PlayingCardType.ANGESETZT:
        return "Angesetzt";
      case PlayingCardType.ORIGINAL:
      default:
        return "Original";
    }
  }

}
