import { Component } from '@angular/core';
import { NavController, Events, LoadingController, ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { RestaurantPortalPage } from '../restaurant-portal/restaurant-portal';

import firebase from 'firebase';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email :     string;
  password :  string;
  userType:   string;
  userToggle: boolean;


  constructor(
    public navCtrl: NavController,
    public events: Events,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {

      this.userType = "User";
      this.userToggle = false;

    }

    loginClicked() {
      if(this.email === undefined || this.password === undefined){
        this.errToast("Please enter valid email and password");
      } else {
        var auth = firebase.auth();
        auth.signInWithEmailAndPassword(this.email, this.password).then(() => {
          if(this.userType == "User"){
            this.events.publish('user:loggedIn', true, auth.currentUser.displayName);
            this.presentLoading(this.userToggle);
          } else {
            this.events.publish('restaurant:loggedIn', true, auth.currentUser.displayName);
            this.presentLoading(this.userToggle);
          }
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

    presentLoading(type) {
      let loader = this.loadingCtrl.create({
        content: "Login successful! Please wait...",
      });
      loader.present();

      setTimeout(() => {
        if( type == false ){
          this.navCtrl.setRoot(TabsPage);
        } else {
          this.navCtrl.setRoot(RestaurantPortalPage);
        }
      }, 2000);

      setTimeout(() => {
        loader.dismiss();
      }, 4000);

    };

    userToggled(){
      this.userType = this.userToggle ? "Restaurant" : "User";
    };

  }
