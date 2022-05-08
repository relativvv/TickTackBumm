import {Player} from "./player.model";
import {GameState} from "../enums/gamestate.enum";

export interface Game {
  id?: number;
  joinKey?: string;
  players: Player[];
  gameState: GameState,
  minPlayers: number;
  maxPlayers: number;
  minBombTime: number;
  maxBombTime: number;
  allowKnown:  boolean,
  allowAsked:  boolean,
  allowOriginal:  boolean,
  allowShaked:  boolean,
  allowSetted: boolean,
  password?: string;
}
