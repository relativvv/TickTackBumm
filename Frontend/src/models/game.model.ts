import {Player} from "./player.model";
import {PlayingCard} from "./card.model";

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
  round?: number;
  gameStep?: number;
  helpString?: string;
  currentCard?: PlayingCard;
  cardState?: string;
  deckState?: string;
}

export interface GameState {
  id: number;
  name?: string;
}

export interface Message {
  sender: Player;
  message: string;
}
