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
    MessageItemComponent
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
        MatChipsModule
    ]
})
export class GameModule { }
