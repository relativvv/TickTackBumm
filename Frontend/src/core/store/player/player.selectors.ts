import {createFeatureSelector} from "@ngrx/store";
import {Player} from "../../../models/player.model";
import {AppConfig} from "../../../models/appconfig.model";

export const selectPlayer = createFeatureSelector<AppConfig>('player');
