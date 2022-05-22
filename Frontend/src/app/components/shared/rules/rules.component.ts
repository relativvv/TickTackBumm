import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.less']
})
export class RulesComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: null,
    public dialogRef: MatDialogRef<RulesComponent>,
  ) { }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

}
