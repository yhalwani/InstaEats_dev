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

  openCheckout(amount, description) {
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_GtPPuYvc17ygIxk7JSktsyxN',
      image: 'https://firebasestorage.googleapis.com/v0/b/instaeats-a06a3.appspot.com/o/img%2FAppIcon-60x60%402x.png?alt=media&token=0918047d-941d-4b42-8c72-609694be2a60',
      locale: 'auto',
      token: function (token: any) {
        let user = firebase.auth().currentUser;
        let userRef = firebase.database().ref('Restaurant Profiles/' + user.uid );
        userRef.update({
          stripe: token
        });
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
      }
    });

    handler.open({
      name: 'InstaEats',
      description: description,
      amount: Number(amount)
    });

  }


}

// finish(){
//   const alert = this.alertCtrl.create({
//     title: 'Confirm purchase',
//     message: 'Do you want to continue with your purchase?',
//     buttons: [
//       {
//         text: 'Cancel',
//         role: 'cancel',
//         handler: () => {
//           console.log('Cancel clicked');
//         }
//       },
//       {
//         text: 'Confirm',
//         handler: () => {
//           console.log("Confirmed");
//           this.createToken();
//         }
//       }
//     ]
//   });
//   alert.present();
// }
//
//
// dismiss() {
//   this.viewCtrl.dismiss();
// };
