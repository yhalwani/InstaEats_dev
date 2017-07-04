import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import firebase from 'firebase';

declare let google;

@Component({
  selector: 'page-restaurant-page',
  templateUrl: 'restaurant-page.html',
})
export class RestaurantPage {
  restaurant : any;
  @ViewChild('map') mapElement : ElementRef;
  map: any;

  Menu: {
    bundleName:            string,
    bundleDescription:     string,
    bundleElem:            Array<{
      menuGroupName:       string,
      menu:                Array<{
        name: string, description: string, price: number, checked: boolean, discount: number
      }>
    }>
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public events: Events
  ) {
    this.restaurant = this.navParams.data;

    var menuNode = firebase.database().ref("MenuItems");

    var restRef = firebase.database().ref("Restaurant Profiles/");

    restRef.orderByChild("liveStatus").equalTo(true).on("value", (snapshot) => {
      var restaurantList = [];
      snapshot.forEach((childSnapshot) => {
        restaurantList.push(childSnapshot.val());

        return false;
      });
    });

  }
//
// ngAfterViewInit(){
//   this.loadMap();
// }
//
// IonViewDidLoad(){
//   this.loadMap();
// }
//
// loadMap(){
//   let latLng = new google.maps.LatLng(43.6010365, -79.641453);
//
//   let mapOptions = {
//     center: latLng,
//     zoom: 18,
//     mapTypeId: google.maps.MapTypeId.ROADMAP
//   }
//
//   this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
// }

  favRest(){
    this.storage.get('favCount').then((val) => {
      if (val == 0) {
        var list = [];
        list.push(this.navParams.data);
        this.storage.set('favList', list);
        this.storage.set('favCount', ++val);
      } else if (val >= 20) {
        this.storage.get('favList').then((list) => {
          if ( this.checkArrayFor(list, this.navParams.data) === false ){
            list.push(this.navParams.data);
            list.shift();
            this.storage.set('favList', list);
          };
        });
      } else {
        this.storage.get('favList').then((list) => {
          if ( this.checkArrayFor(list, this.navParams.data) === false ){
            list.push(this.navParams.data);
            this.storage.set('favList', list);
            this.storage.set('favCount', ++val)
          };
        });
      };
    });
    this.events.publish('restaurant:favorited');
  }

  checkArrayFor(arr, obj){
    for (var x = 0; x < arr.length; x++){
      if(arr[x].restaurantName === obj.restaurantName){
        return true;
      }
    }
    return false;
  }


}
