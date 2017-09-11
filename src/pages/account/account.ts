import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { User } from '../../providers/user';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  email:    string;
  password: string;
  userName: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: User
  ) {

    this.email = this.userService.user.email;
    this.userName = this.userService.user.username;
    this.password = "";

  };

  accountInfoUpdate(){
    let ref =  firebase.database().ref("/User Profiles");
    let user = firebase.auth().currentUser;
    let uid = user.uid;

    // change user password
    this.userService.changePassword(this.password);

    try{
      ref.child(uid).update({
        displayName: this.userName,
        email: this.email,
        pass: this.password
      });
    }catch(error){
      ref.child(uid).update({
        displayName: user.displayName,
        email: user.email
      });
    }
  };


};
