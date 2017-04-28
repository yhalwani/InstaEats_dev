import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import firebase from 'firebase';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  username : string;
  email : string;
  password : string;
  fbAuthID : string;

  constructor(public navCtrl: NavController, public events: Events) {

  }

  signUpClicked(){

    var auth = firebase.auth();
    var userRef = firebase.database().ref("/User Profiles");

    auth.createUserWithEmailAndPassword(this.email, this.password).then((user) => {
    // if user created, then update the user displayName

      var currentUser = auth.currentUser;
      var id = currentUser.uid;
      this.fbAuthID = id;

      userRef.child(id).update({
        email: this.email,
        pass: this.password,
        displayName: this.username
      });

      this.events.publish('user:loggedIn', true);


    //Handle Error
    }, function(error) {

      //Toast Alert
      if (error) {
        alert(error.message);
      } else {
        console.error(error);
      }

    });

    this.navCtrl.setRoot(TabsPage);

  }

}
