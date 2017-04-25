import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';

@Component({
  selector: 'page-restaurant-page',
  templateUrl: 'restaurant-page.html',
})
export class RestaurantPage {

  // restaurant : {
  //   "name" : any
  // };

  //restaurant['name']
  //restaurant.name

  restaurantName
  restaurantImg


  constructor(public navCtrl: NavController, public navParams: NavParams) {

    //this.restaurant.name = navParams.get('restaurantName');
    this.restaurantName = navParams.get('restaurantName');
    this.restaurantImg = navParams.get('imgUrl');

  }


}
