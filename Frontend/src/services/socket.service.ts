import { Injectable } from '@angular/core';
import {environment} from "../environments/environment";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: WebSocket;

  constructor(
    private readonly toastService: ToastrService
  ) { }

  public handleSocket(): void {
    this.socket = new WebSocket(environment.webSocketUrl);
    this.socket.onopen = () => { };

    this.socket.onerror = () => {
      this.toastService.error('Eine Verbindung zum WebSocket ist fehlgeschlagen..');
    }
  }

  public getSocket(): WebSocket | null {
    return this.socket ? this.socket : null;
  }
}
