import {createAction, props} from "@ngrx/store";
import {Player} from "../../../models/player.model";

export const setPlayer = createAction(
  '[User] Set Player',
  props<{ player: Player }>()
);
