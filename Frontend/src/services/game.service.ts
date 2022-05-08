import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Game} from "../models/game.model";
import {Observable} from "rxjs";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private backend = environment.backendUrl

  constructor(
    private readonly http: HttpClient
  ) { }

  public getGameByJoinKey(key: string): Observable<Game> {
    return this.http.get<Game>(this.backend + '/game/' + key);
  }

  public createGame(game: Game): Observable<Game> {
    return this.http.post<Game>(this.backend + '/game', game);
  }
}
