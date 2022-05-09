import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  public getRandomProfileImageString() {
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
      "../../../../assets/images/profile10.png",
      "../../../../assets/images/profile11.png",
      "../../../../assets/images/profile12.jpeg",
    ]

    const rnd = Math.floor(Math.random() * profileImages.length);
    return profileImages[rnd];
  }

}
