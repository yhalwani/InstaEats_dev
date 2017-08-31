import { Injectable } from '@angular/core';

@Injectable()
export class User {

  user : {
    email: string,
    username: any,
    loggedIn: boolean,
    fcmToken: any
  };

  constructor() {
    this.user = {email: "", username: "", loggedIn: false, fcmToken: ""};
  }

}
