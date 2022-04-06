import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import { PlayingCardComponent } from './components/shared/playing-card/playing-card.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {ReactiveFormsModule} from "@angular/forms";
import { GameCreationComponent } from './components/game/game-creation/game-creation.component';
import { GameComponent } from './components/game/game.component';
import { UserListComponent } from './components/game/game-creation/user-list/user-list.component';
import { UserItemComponent } from './components/game/game-creation/user-list/user-item/user-item.component';
import { ChatComponent } from './components/game/game-creation/chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlayingCardComponent,
    GameCreationComponent,
    GameComponent,
    UserListComponent,
    UserItemComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
