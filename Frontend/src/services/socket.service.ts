import { Injectable } from '@angular/core';
import {environment} from "../environments/environment";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: WebSocket;
  private playerResourceId: string;

  constructor(
    private readonly toastService: ToastrService,
    private readonly router: Router
  ) { }

  public handleSocket(): void {
    this.socket = new WebSocket(environment.webSocketUrl);
    this.socket.onopen = () => {
      this.socket.send(JSON.stringify({
        type: 'getResourceId'
      }));

      this.socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if(data.type === 'resourceId') {
          this.playerResourceId = data.resourceId;
        }
      }
    };

    this.socket.onerror = () => {
      this.toastService.error('Eine Verbindung zum WebSocket ist fehlgeschlagen..');
      this.router.navigate(['/']);
    }
  }

  public getSocket(): WebSocket | null {
    return this.socket ? this.socket : null;
  }
}
