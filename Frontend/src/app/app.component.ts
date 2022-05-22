import { Component } from '@angular/core';
import {SocketService} from "../services/socket.service";
import {MatDialog} from "@angular/material/dialog";
import {RulesComponent} from "./components/shared/rules/rules.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'TickTackBumm |';

  constructor(
    private readonly socketService: SocketService,
    private readonly matDialogService: MatDialog,
  ) {
    this.socketService.handleSocket();
  }

  openRules(): void {
    this.matDialogService.open(RulesComponent);
  }
}
