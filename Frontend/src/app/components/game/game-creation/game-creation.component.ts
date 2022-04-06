import { Component, OnInit } from '@angular/core';
import {User} from "../../../../models/user.model";

@Component({
  selector: 'app-game-creation',
  templateUrl: './game-creation.component.html',
  styleUrls: ['./game-creation.component.less']
})
export class GameCreationComponent implements OnInit {

  users: User[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
