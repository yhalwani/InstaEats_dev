import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { RestaurantPortalPage } from '../restaurant-portal/restaurant-portal';

import firebase from 'firebase';

declare var stripe: any;

@Component({
  selector: 'page-stripe',
  templateUrl: 'stripe.html',
})
export class StripePage {

  codeIsValid: boolean = false;
  promo: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    private formBuilder: FormBuilder
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

  }

  returnToDash(){
    this.viewCtrl.dismiss();
  }

  validate(event: any){

    if(this.promo){
      if(this.promo.toLowerCase() == "60dayseats"){
        this.codeIsValid = true;
        let alert = this.alertCtrl.create({
          title: 'Promo-code applied',
          subTitle: 'Promotional discount will be reflected on your invoice',
          buttons: ['Dismiss']
        });
        alert.present();
      }
      else if(this.promo.toLowerCase() != "60dayseats"){
        this.codeIsValid = false;
        let toast = this.toastCtrl.create({
          message: "Invalid Coupon",
          duration: 3000,
          position: 'top'
        })
        toast.present();
      }
    }
    else if(this.promo == null || this.promo == ''){
      this.codeIsValid = false;
      console.log("no coupon");
    }
  }

}
