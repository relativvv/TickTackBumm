import {createFeatureSelector} from "@ngrx/store";
import {AppConfig} from "../../../models/appconfig.model";

export const selectGame = createFeatureSelector<AppConfig>('game');
