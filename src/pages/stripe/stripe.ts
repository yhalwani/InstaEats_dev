import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ToastController } from 'ionic-angular';

import { RestaurantPortalPage } from '../restaurant-portal/restaurant-portal';

import firebase from 'firebase';

declare var stripe: any;

@Component({
  selector: 'page-stripe',
  templateUrl: 'stripe.html',
})
export class StripePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController
  ) {

  }

  errToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'bottom'
    });

    toast.present();
  }

  openCheckout(amount, description, planID) {
    let user = firebase.auth().currentUser;
    let uid = user.uid;
    let userRef = firebase.database().ref('Restaurant Profiles/').child(uid);

    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_GtPPuYvc17ygIxk7JSktsyxN',
      image: 'https://firebasestorage.googleapis.com/v0/b/instaeats-a06a3.appspot.com/o/img%2FAppIcon-60x60%402x.png?alt=media&token=0918047d-941d-4b42-8c72-609694be2a60',
      locale: 'auto',
      token: ((token: any) => {
        userRef.child('stripe').update({
          token,
          plan: planID
        });
      })
    });

    handler.open({
      name: 'InstaEats',
      description: description,
      amount: Number(amount)
    });

  }

  returnToDash(){
    this.viewCtrl.dismiss();
  }

}
