import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import firebase from 'firebase';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  username : string;
  email : string;
  password : string;

  constructor(public navCtrl: NavController) {

  }

  signUpClicked(){

    var auth = firebase.auth();
    var userRef = firebase.database().ref("/User Profiles");

    auth.createUserWithEmailAndPassword(this.email, this.password).then((user) => {
    // if user created, then update the user displayName

      var currentUser = auth.currentUser;
      var id = currentUser.uid;

      userRef.child(id).update({
        email: this.email,
        pass: this.password,
        displayName: this.username
      });

      user.updateProfile({
        displayName: this.username
      }).then(function() {
        console.log("Username updated");
      }, function(error) {
        console.log("Unable to update username");
      });

    }, function(error) {

      if (error) {
        alert(error.message);
      } else {
        console.error(error);
      }

    });

  }

}
