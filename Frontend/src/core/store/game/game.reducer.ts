import {Player} from "../../../models/player.model";
import {createReducer, on} from "@ngrx/store";
import {setGame} from "./game.actions";

export const initialState: Player = null;

export const gameReducer = createReducer(
  initialState,
  on(
    setGame,
    (
      state,
      { game }
    ) => ({
      ...state,
      game
    }),
)
);
