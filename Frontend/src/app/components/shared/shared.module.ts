import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PlayingCardComponent} from "./playing-card/playing-card.component";
import {MatIconModule} from "@angular/material/icon";



@NgModule({
  declarations: [
    PlayingCardComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ]
})
export class SharedModule { }
