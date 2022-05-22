import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import { RulesComponent } from './rules/rules.component';
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";



@NgModule({
  declarations: [
    RulesComponent
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class SharedModule { }
