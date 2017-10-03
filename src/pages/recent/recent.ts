import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { RestaurantPage }         from '../restaurant-page/restaurant-page';

@Component({
  selector: 'page-about',
  templateUrl: 'recent.html'
})
export class RecentPage {

  restList: Array<{ blurb: any, imgURL: string, liveStatus: boolean, restaurantName: any }>;

  constructor(public navCtrl: NavController, public events: Events, public storage: Storage) {

    this.storage.get('recentList').then((list) => {
      this.restList = list.reverse();
    });

    events.subscribe('restaurant:viewed', () => {
      this.storage.get('recentList').then((list) => {
        this.restList = list.reverse();
      });
    });

  }

  ionViewDidLoad(){
    this.storage.get('recentList').then((list) => {
      this.restList= list.reverse();
    });
  }

  ionViewDidEnter(){
    this.storage.get('recentList').then((list) => {
      this.restList = list.reverse();
    });
  }

  goToRestPage(index){
    this.events.publish('restaurant:viewed');
    this.navCtrl.push(RestaurantPage, this.restList[index]);
  };


}
