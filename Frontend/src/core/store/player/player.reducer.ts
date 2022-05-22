import {Player} from "../../../models/player.model";
import {createReducer, on} from "@ngrx/store";
import {setPlayer} from "./player.actions";

export const initialState: Player = null;

export const playerReducer = createReducer(
  initialState,
  on(
    setPlayer,
    (
      state,
      { player }
    ) => ({
      ...state,
      player
    }),
)
);
