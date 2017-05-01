import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-restaurant-page',
  templateUrl: 'restaurant-page.html',
})
export class RestaurantPage {

  restaurantName
  restaurantImg

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.restaurantName = navParams.get('restaurantName');
    this.restaurantImg = navParams.get('imgUrl');

  }


}
