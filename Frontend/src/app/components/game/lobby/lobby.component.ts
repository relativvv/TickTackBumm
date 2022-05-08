import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Clipboard} from "@angular/cdk/clipboard";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Game} from "../../../../models/game.model";
import {combineLatest} from "rxjs";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.less']
})
export class LobbyComponent implements OnInit {

  @Input() game: Game;
  form: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly clipboard: Clipboard,
    private readonly toastService: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.form = this.formBuilder.group({
      allowKnown: [true],
      allowAsked: [true],
      allowOriginal: [true],
      allowShaked: [true],
      allowSetted: [true],
      minBombTime: [10, [Validators.required, Validators.min(1)]],
      maxBombTime: [50, [Validators.required, Validators.max(999)]],
      minPlayers: [3, [Validators.required, Validators.min(3)]],
      maxPlayers: [8, [Validators.required, Validators.max(16)]],
    });

    const minPlayerValueChange$ = this.form.get('minPlayers').valueChanges;
    const maxPlayerValueChanges$ = this.form.get('maxPlayers').valueChanges;

    combineLatest([minPlayerValueChange$, maxPlayerValueChanges$])
      .subscribe(([minP, maxP]) => {
        this.game.minPlayers = minP;
        this.game.maxPlayers = maxP;
      })
  }

  copyLink(): void {
    this.clipboard.copy(window.location.href);
    this.toastService.success('Link kopiert!');
  }

  startGame(): void {
    document.getElementsByClassName('body')[0].classList.add('fade-out');
    setTimeout(() => {
      document.getElementsByClassName('body')[0].classList.add('hidden');
    }, 2500);
  }

  isFormInvalid(): boolean {
    return this.form.invalid || !this.isBombTimeAllowed() || !this.isPlayerCountAllowed();
  }

  private isBombTimeAllowed(): boolean {
    return this.form.get('minBombTime').value < this.form.get('maxBombTime').value
  }


  private isPlayerCountAllowed(): boolean {
    return this.form.get('minPlayers').value < this.form.get('maxPlayers').value
  }

}
