import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { RestaurantPortalPage } from '../restaurant-portal/restaurant-portal';

import firebase from 'firebase';

@Component({
  selector: 'page-stripe',
  templateUrl: 'stripe.html',
})
export class StripePage {

  codeIsValid: boolean = false;
  private promocode : FormGroup;
  promo: any;
  my_color: any = '#488aff';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    private formBuilder: FormBuilder
  ) {

    this.promocode = this.formBuilder.group({
      promo: ['', this.validate],
    });

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
    // if(this.promo == null){
    //   this.promo = "none";
    // }

    this.codeIsValid = true;

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
          promocode: this.promocode.value
        });
      })
    });

    handler.open({
      name: 'InstaEats',
      description: description + " discount applied",
      amount: Number(amount)
    });

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

  validate(){
    if(this.promo == "60dayseats"){
      this.my_color = '#44b31b';
      console.log("VALID");
    }
    if(this.promo == null){
      console.log("no coupon");
    }
    if(this.promo != "60dayseats"){
      this.my_color = '#da3937';
      console.log("in valid");
    }
  }

  // // function to validate coupon code
  // validate(control: FormControl): any{
  //
  //   if(control.value == null){
  //     console.log("No coupon used")
  //   }
  //   if(control.value.toLowerCase() == "60dayseats"){
  //     return "valid coupon"
  //   } else {
  //     return "invalid coupon"
  //   }
  // }

}
