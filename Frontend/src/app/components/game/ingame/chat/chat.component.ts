import {Component, Input, OnInit} from '@angular/core';
import {SocketService} from "../../../../../services/socket.service";
import {UserService} from "../../../../../services/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Message} from "../../../../../models/game.model";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent implements OnInit {

  @Input() messages: Message[];

  form: FormGroup;

  constructor(
    private readonly socketService: SocketService,
    private readonly usersService: UserService,
    private readonly formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    // this.createForm();
  }

  // sendMessage(): void {
  //   if(this.form.invalid) {
  //     return;
  //   }
  //
  //   const message = this.form.get('message');
  //   const payload = {
  //     type: 'sendMessage',
  //     msg: message.value,
  //     joinKey: this.game.joinKey,
  //     player: {
  //       resourceId: this.player.resourceId,
  //       userName: this.player.userName,
  //       image: this.player.image,
  //       creator: this.player.creator
  //     }
  //   }
  //
  //   this.socketService.getSocket().send(JSON.stringify(payload));
  //
  //   const messageItem: Message = {
  //     message: this.form.get('message').value,
  //     sender: this.player
  //   }
  //
  //   this.messages.push(messageItem);
  //   this.form.get('message').patchValue('');
  // }
  //
  // private createForm(): void {
  //   this.form = this.formBuilder.group({
  //     message: ['', [Validators.required]]
  //   })
  // }

}
