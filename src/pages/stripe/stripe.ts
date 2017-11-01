import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ToastController } from 'ionic-angular';
import { Stripe } from '@ionic-native/stripe';

@Component({
  selector: 'page-stripe',
  templateUrl: 'stripe.html',
})
export class StripePage {

  // Stripe variables
  cardHolder: string;
  cardNumber: number;
  expiry:     number;
  cvv:        number;
  userToken:  any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private stripe: Stripe,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController
  ) {

    // Stripe Key
    this.stripe.setPublishableKey('pk_test_GtPPuYvc17ygIxk7JSktsyxN');

  }

  ionViewDidLoad() {

  }

  createToken(){
    // Trigger card addition and subscription
    let card = {
      number: this.cardNumber.toString(),
      expMonth: Number(this.expiry.toString().split("-")[1]),
      expYear: Number(this.expiry.toString().split("-")[0]),
      cvc: this.cvv.toString()
    };

    this.stripe.createCardToken(card).then((token) => {
      console.log(token);
      this.errToast(token);
    })
      //handle error
      .catch((error) => {
        console.log(error);
        this.errToast(error);
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

  finish(){
    const alert = this.alertCtrl.create({
      title: 'Confirm purchase',
      message: 'Do you want to continue with your purchase?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            console.log("Confirmed");
            this.createToken();
          }
        }
      ]
    });
    alert.present();
  }


  dismiss() {
    this.viewCtrl.dismiss();
  };


}
