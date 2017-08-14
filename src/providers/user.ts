import { Injectable } from '@angular/core';

@Injectable()
export class User {

  user : {
    username: any,
    loggedIn: boolean
  };

  constructor() {
    this.user = {username: "", loggedIn: false};
  }

}
