import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ToastController } from 'ionic-angular';

import { RestaurantPortalPage } from '../restaurant-portal/restaurant-portal';

import firebase from 'firebase';

@Component({
  selector: 'page-stripe',
  templateUrl: 'stripe.html',
})
export class StripePage {

  promo: string;
  codeIsValid: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
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
    if(this.promo == null){
      this.promo = "none";
    }

    // if(this.codeIsValid){
      let user = firebase.auth().currentUser;
      let uid = user.uid;
      let userRef = firebase.database().ref('Restaurant Profiles/').child(uid);

      var handler = (<any>window).StripeCheckout.configure({
        key: 'pk_test_GtPPuYvc17ygIxk7JSktsyxN',
        locale: 'auto',
        token: ((token: any) => {
          userRef.child('stripe').update({
            token,
            plan: planID,
            promocode: this.promo
          });
        })
      });

      handler.open({
        name: 'InstaEats',
        description: description + " discount applied",
        amount: Number(amount)
      });
    // }
    // if(!this.codeIsValid){
    //     let alert = this.alertCtrl.create({
    //       title: 'Validation failed',
    //       subTitle: 'Promocode you enter is incorrect or not valid.',
    //       buttons: ['Dismiss']
    //     });
    //     alert.present();
    // }

  }

  returnToDash(){
    this.viewCtrl.dismiss();
  }

}
