import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { RestaurantPage } from '../restaurant-page/restaurant-page';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html'
})
export class FavoritesPage {

  restList: Array<{ blurb: any, imgURL: string, liveStatus: boolean, restaurantName: any }>;

  constructor(public navCtrl: NavController, public events: Events, public storage: Storage) {
    this.storage.get('favList').then((list) => {
        this.setList(list);
    });

    events.subscribe('restaurant:favorited', () => {
      this.storage.get('favList').then((list) => {
      this.setList(list);
      });
    });
  };

  ionViewDidLoad(){
    this.storage.get('favList').then((list) => {
      this.setList(list);
    });
  };

  ionViewDidEnter(){
    this.storage.get('favList').then((list) => {
      this.setList(list);
    });
  };

  setList(arr){
    if(arr.length === 0){
      this.restList = arr;
    } else {
      this.restList = arr.reverse();
    };
  };

  deleteRest(index){
    if(index === 0){
      this.restList.shift();
    } else {
      this.restList.splice(index, index);
    }
    this.storage.set('favList', this.restList);
    this.storage.get('favCount').then((val) => {
          this.storage.set('favCount', --val);
    });

  }

  muteRest(index){

  }

  goToRestPage(index){
    this.events.publish('restaurant:viewed');
    this.navCtrl.push(RestaurantPage, this.restList[index]);
  }

}
