import { Component }              from '@angular/core';
import { NavController, Events }  from 'ionic-angular';
import { RestaurantPage }         from '../restaurant-page/restaurant-page';
import { Storage }                from '@ionic/storage';
import { User }                   from '../../providers/user';
import { FcmNotifications }       from '../../providers/fcm-notifications';


@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html'
})
export class FavoritesPage {

  restList: Array<{ blurb: any, imgURL: string, liveStatus: boolean, restaurantName: any }>;

  constructor(
    public navCtrl: NavController,
    public events: Events,
    public storage: Storage,
    public user: User,
    public fcm: FcmNotifications
  ) {

    this.storage.get('favList').then((list) => {
        this.setList(list);
    });

    events.subscribe('restaurant:favorited', (restaurant) => {

      this.storage.get('favCount').then((val) => {
        if (val == 0) {
          var list = [];
          list.push(restaurant);
          this.storage.set('favList', list);
          this.storage.set('favCount', ++val);
        } else if (val >= 20) {
          this.storage.get('favList').then((list) => {
            if ( this.checkArrayFor(list, restaurant) === false ){
              list.push(restaurant);
              list.shift();
              this.storage.set('favList', list);
            };
          });
        } else {
          this.storage.get('favList').then((list) => {
            if ( this.checkArrayFor(list, restaurant) === false ){
              list.push(restaurant);
              this.storage.set('favList', list);
              this.storage.set('favCount', ++val)
            };
          });
        };
      });

      this.storage.get('favList').then((list) => {
        this.setList(list);
      });

      this.fcm.fcmSubscribe(restaurant.restaurantName);

    });

    events.subscribe('restaurant:unfavorited', (restaurant) => {

      for (var x = 0; x < this.restList.length; x++){
        if(this.restList[x].restaurantName === restaurant.restaurantName){
          let index = x;
          this.deleteRest(index);
          break;
        };
      };

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

    this.fcm.fcmUnsubscribe(this.restList[index].restaurantName);

    if(index === 0){
      this.restList.shift();
    } else {
      this.restList.splice(index, index);
    }
    this.storage.set('favList', this.restList);
    this.storage.get('favCount').then((val) => {
          this.storage.set('favCount', --val);
    });

  };

  // mute notifications for restaurant
  muteRest(index){

  };

  goToRestPage(index){
    this.events.publish('restaurant:viewed');
    this.navCtrl.push(RestaurantPage, this.restList[index]);
  };

  checkArrayFor(arr, obj){
    for (var x = 0; x < arr.length; x++){
      if(arr[x].restaurantName === obj.restaurantName){
        return true;
      }
    }
    return false;
  };

};
