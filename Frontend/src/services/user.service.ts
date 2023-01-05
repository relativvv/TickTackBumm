import { Injectable } from '@angular/core';
import {Store} from "@ngrx/store";
import {setPlayer} from "../core/store/player/player.actions";
import {Player} from "../models/player.model";
import {Observable} from "rxjs";
import {selectPlayer} from "../core/store/player/player.selectors";
import {AppConfig} from "../models/appconfig.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private readonly store: Store
  ) { }

  public setPlayer(player: Player): void {
    this.store.dispatch(setPlayer({player: player}));
  }

  public getPlayer(): Observable<AppConfig> {
    return this.store.select(selectPlayer);
  }

  public getRandomProfileImageString() {
    const profileImages = [
      "../../../../assets/images/profile1.jpg",
      "../../../../assets/images/profile2.jpg",
      "../../../../assets/images/profile3.jpg",
      "../../../../assets/images/profile4.png",
      "../../../../assets/images/profile5.jpg",
      "../../../../assets/images/profile6.jpg",
      "../../../../assets/images/profile7.PNG",
      "../../../../assets/images/profile8.jpg",
      "../../../../assets/images/profile9.jpg",
      "../../../../assets/images/profile10.jpg",
      "../../../../assets/images/profile11.png",
      "../../../../assets/images/profile12.jpeg",
      "../../../../assets/images/profile13.jpeg",
      "../../../../assets/images/profile14.jpeg",
      "../../../../assets/images/profile15.jpeg",
      "../../../../assets/images/profile16.jpeg",
      "../../../../assets/images/profile18.jpg",
    ]

    const rnd = Math.floor(Math.random() * profileImages.length);
    return profileImages[rnd];
  }

  public hasPermission(player): boolean {
    return player ? player.creator : false;
  }
}
