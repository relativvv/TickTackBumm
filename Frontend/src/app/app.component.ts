import { Component } from '@angular/core';
import {SocketService} from "../services/socket.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'TickTackBumm |';

  constructor(private readonly socketService: SocketService) {
    this.socketService.handleSocket();
  }
}
