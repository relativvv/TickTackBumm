import {createAction, props} from "@ngrx/store";
import {Game} from "../../../models/game.model";

export const setGame = createAction(
  '[User] Set Game',
  props<{ game: Game }>()
);
