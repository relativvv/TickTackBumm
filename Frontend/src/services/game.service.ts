import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Game} from "../models/game.model";
import {Observable} from "rxjs";
import {environment} from "../environments/environment";
import {SocketService} from "./socket.service";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private backend = environment.backendUrl

  constructor(
    private readonly http: HttpClient,
    private readonly socketService: SocketService
  ) { }

  public getGameByJoinKey(key: string): Observable<Game> {
    return this.http.get<Game>(this.backend + '/game/' + key);
  }

  public createGame(game: Game): Observable<Game> {
    return this.http.post<Game>(this.backend + '/game', game);
  }

  public verifyPassword(key: string, password: string): Observable<void> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('password', password);

    return this.http.get<void>(this.backend + '/game/' + key + '/verifyPassword', { params: httpParams });
  }

  public updateGame(gameId: number, game: Game): Observable<Game> {
    return this.http.put<Game>(this.backend + '/game/' + gameId, game);
  }

  public sendGameUpdate(game: Game): void {
    this.socketService.getSocket().send(JSON.stringify({
      type: 'gameUpdate',
      joinKey: game.joinKey,
      game: game
    }));
  }
}
