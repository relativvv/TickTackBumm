import {createFeatureSelector} from "@ngrx/store";
import {AppConfig} from "../../../models/appconfig.model";

export const selectPlayer = createFeatureSelector<AppConfig>('player');
