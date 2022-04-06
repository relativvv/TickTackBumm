import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../../../models/user.model";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.less']
})
export class UserListComponent implements OnInit {

  @Input() users: User[];

  constructor() { }

  ngOnInit(): void {
  }

}
