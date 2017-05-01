import { Component } from '@angular/core';
import { NavController, Events, LoadingController, ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

import firebase from 'firebase';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email : string;
  password : string;


  constructor(
    public navCtrl: NavController,
    public events: Events,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {

  }

  loginClicked() {

    if(this.email === undefined || this.password === undefined){
      this.errToast("Please enter valid email and password");
    } else {
      var auth = firebase.auth();
      auth.signInWithEmailAndPassword(this.email, this.password).then(() => {
        this.events.publish('user:loggedIn', true, auth.currentUser.displayName);
        this.presentLoading();
      }, (error) => {
        this.errToast(error.message);
      });
    }

  }

  errToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Login successful! Please wait...",
    });
    loader.present();

    setTimeout(() => {
      this.navCtrl.setRoot(TabsPage);
    }, 2000);

    setTimeout(() => {
      loader.dismiss();
    }, 4000);

  }

}
