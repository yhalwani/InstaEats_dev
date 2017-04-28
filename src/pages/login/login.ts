import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

import firebase from 'firebase';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email : string;
  password : string;


  constructor(public navCtrl: NavController, public events: Events) {

  }

  loginClicked() {

    var auth = firebase.auth();

    auth.signInWithEmailAndPassword(this.email, this.password).then(() => {
      
      this.events.publish('user:loggedIn', true);
      this.navCtrl.setRoot(TabsPage);

    }, function(error) {

      //Handle Error
      if (error.message === 'auth/wrong-password') {
        alert("Incorrect Password");
      } else {
        console.log(error.name);
        alert(error.message);
      }
    });

  }


}
