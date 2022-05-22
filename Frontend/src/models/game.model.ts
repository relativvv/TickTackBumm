import {Player} from "./player.model";

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
  enableJoker: boolean;
  password?: string;
  hasPassword: boolean;
  currentPlayer?: Player;
  bombTime?: number;
}

export interface GameState {
  id: number;
  name?: string;
}

export interface Message {
  sender: Player;
  message: string;
}
