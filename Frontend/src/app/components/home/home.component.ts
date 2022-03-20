import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  creationForm: FormGroup;
  imageSource: string;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly titleService: Title
  ) {
    this.titleService.setTitle('Tick-Tack-Bumm | Startseite');
  }

  ngOnInit(): void {
    this.createForm();
    this.imageSource = HomeComponent.getRandomProfileImageString();
  }

  setRandomProfileImage(): void {
    document.getElementById('refresh-profile').setAttribute('disabled', 'true');
    document.getElementById('refresh-profile').classList.add('disabled');

    this.imageSource = HomeComponent.getRandomProfileImageString();

    setTimeout(() => {
      document.getElementById('refresh-profile').removeAttribute('disabled')
      document.getElementById('refresh-profile').classList.remove('disabled');
    }, 1000);
  }

  private static getRandomProfileImageString() {
    const profileImages = [
      "../../../../assets/images/profile1.jpg",
      "../../../../assets/images/profile2.jpg",
      "../../../../assets/images/profile3.jpg",
      "../../../../assets/images/profile4.png",
      "../../../../assets/images/profile5.jpg",
      "../../../../assets/images/profile6.jpg",
      "../../../../assets/images/profile7.PNG",
      "../../../../assets/images/profile8.jpg",
      "../../../../assets/images/profile9.jpg",
    ]

    const rnd = Math.floor(Math.random() * 9);
    return profileImages[rnd];
  }

  private createForm(): void {
    this.creationForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      setPassword: [false],
      passwordValue: [{value: '', disabled: true}]
    });

    this.creationForm.get('setPassword')
      .valueChanges
      .subscribe((setPassword: boolean) => {
        setPassword === true ? this.creationForm.get('passwordValue').enable() : this.creationForm.get('passwordValue').disable();
      })
  }

}
