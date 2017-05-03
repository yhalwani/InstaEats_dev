import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-restaurant-page',
  templateUrl: 'restaurant-page.html',
})
export class RestaurantPage {

  restaurantName
  restaurantImg

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {

    this.restaurantName = navParams.get('restaurantName');
    this.restaurantImg = navParams.get('imgUrl');

  }

  favRest(){

    console.log(this.navParams.data);
    this.storage.get('favCount').then((val) => {
      
    })

    // this.storage.get('recentCount').then((val) => {
    //
    //   if (val == 0) {
    //
    //     var list = [];
    //     list.push(this.restList[index]);
    //     this.storage.set('recentList', list);
    //     this.storage.set('recentCount', ++val);
    //
    //   } else if (val >= 20) {
    //
    //     this.storage.get('recentList').then((list) => {
    //       if( this.checkArrayFor( list, this.restList[index] ) === false ){
    //         list.push(this.restList[index]);
    //         list.shift();
    //         this.storage.set('recentList', list);
    //       }
    //     });
    //
    //   } else {
    //
    //     this.storage.get('recentList').then((list) => {
    //       if( this.checkArrayFor( list, this.restList[index] ) === false ){
    //         list.push(this.restList[index]);
    //         this.storage.set('recentList', list);
    //         this.storage.set('recentCount', ++val);
    //       }
    //     });
    //
    //   };
    //
    // });
    //
    // this.events.publish('restaurant:viewed');


  }


}
