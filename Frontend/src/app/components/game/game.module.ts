import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LobbyComponent} from "./lobby/lobby.component";
import {GameComponent} from "./game.component";
import { IngameComponent } from './ingame/ingame.component';
import { PlayerListComponent } from './lobby/player-list/player-list.component';
import { PlayerItemComponent } from './lobby/player-list/player-item/player-item.component';
import {MatIconModule} from "@angular/material/icon";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import { JoinGameComponent } from './lobby/modals/join-game/join-game.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatTooltipModule} from "@angular/material/tooltip";
import {SharedModule} from "../shared/shared.module";
import { ChatComponent } from './ingame/chat/chat.component';
import { GameAreaComponent } from './ingame/game-area/game-area.component';
import { MessageItemComponent } from './ingame/chat/message-item/message-item.component';
import {MatChipsModule} from "@angular/material/chips";
import { PlayerOrderComponent } from './ingame/player-order/player-order.component';
import { PlayerDetailsComponent } from './modals/player-details/player-details.component';
import {PlayingCardComponent} from "./ingame/playing-card/playing-card.component";
import { DeckComponent } from './ingame/deck/deck.component';
import {NgxTypedJsModule} from "ngx-typed-js";
import { StartingCountdownComponent } from './lobby/starting-countdown/starting-countdown.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    LobbyComponent,
    GameComponent,
    IngameComponent,
    PlayerListComponent,
    PlayerItemComponent,
    JoinGameComponent,
    ChatComponent,
    GameAreaComponent,
    MessageItemComponent,
    PlayerOrderComponent,
    PlayerDetailsComponent,
    PlayingCardComponent,
    DeckComponent,
    StartingCountdownComponent
  ],
    imports: [
        CommonModule,
        MatIconModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatDialogModule,
        MatTooltipModule,
        SharedModule,
        MatChipsModule,
        NgxTypedJsModule,
        MatProgressSpinnerModule
    ]
})
export class GameModule { }
