import { Component } from '@angular/core';
import { App, ViewController, NavController } from 'ionic-angular';

import { InfoPage } from '../info/info';
import { MenuPage } from '../menu/menu';
import { DiscountsPage } from '../discounts/discounts';

import { StripePage } from '../stripe/stripe';

import firebase from 'firebase';


@Component({
  templateUrl: 'restaurant-portal.html'
})
export class RestaurantPortalPage {

  tab1Root = InfoPage;
  tab2Root = MenuPage;
  tab3Root = DiscountsPage;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public appCtrl: App
  ) {

    let user = firebase.auth().currentUser;
    let stripe;
    let rest = firebase.database().ref('Restaurant Profiles/' + user.uid).once('value', (snapshot) => {
      let data = snapshot.val();
      stripe = data.stripe.subscribed;
    });

    if(stripe == true){

    } else {
      this.navCtrl.push(StripePage, user.uid);
    }

  }

}
