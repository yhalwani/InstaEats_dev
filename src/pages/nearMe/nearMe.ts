import { Component } from '@angular/core';
import { NavController, Events, ToastController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LaunchNavigator, LaunchNavigatorOptions }  from '@ionic-native/launch-navigator';
import { RestaurantPage } from '../restaurant-page/restaurant-page';

import firebase from 'firebase';

import { Map }          from '../../providers/map';

@Component({
  selector: 'page-nearMe',
  templateUrl: 'nearMe.html'
})
export class NearMePage {

  // Array structures to hold restaurants pulled from Firebase
  liveList: Array<{
    slogan: any,
    description: string,
    id: string,
    imgURL: string,
    liveStatus: boolean,
    restaurantName: any,
    cuisineType: any,
    coordinates: Array<{name: any, lat: number, lng: number}>,
    address: any,
    distance: number
  }>;

  deadList: Array<{
    slogan: any,
    description: string,
    id: string,
    imgURL: string,
    liveStatus: boolean,
    restaurantName: any,
    cuisineType: any,
    coordinates: Array<{name: any, lat: number, lng: number}>,
    address: any,
    distance: number
  }>;

  // Dynamic variables that change according to
  nearMeViews: string = "listView";
  iconName: string = "map";

  // TODO: get input from the slider and pass as radius to create circle
  minLimit: number = 0;  // 0 km
  maxLimit: number = 100000; // 100 km
  distance: number = 5000;  // default radius 5 km

  plat: { platform: any, assetPath: any};
  searchInput: any = null;

  constructor(
    public navCtrl: NavController,
    public events: Events,
    public storage: Storage,
    public toastCtrl: ToastController,
    public plt: Platform,
    public map: Map,
    private launchNavigator: LaunchNavigator
  ) {

    this.setList();

    if(this.plt.is('ios')){
      this.plat = { platform: "header-icon-ios", assetPath: "assets/icon/icon.png"};
    } else {
      this.plat = { platform: "header-icon-md", assetPath: "assets/icon/icon.png"};
    };

  };

  setList(){

    let restRef = firebase.database().ref("Restaurant Profiles/");

    restRef.orderByChild("liveStatus").on("value", (snapshot) => {
      let liveList  = [];
      let deadList  = [];

      if(snapshot){

      snapshot.forEach((childSnapshot) => {
        if(childSnapshot.val().liveStatus == true && childSnapshot.val().stripe.subscribed == true) {
          liveList.push(childSnapshot.val());
          // let address = childSnapshot.val().address.split(",");
          for(let i=0; i<liveList.length; i++){
            liveList[i].address = String(liveList[i].address).split(",");
          }
          if(this.map.mapObject.lat != this.map.defaultLat || this.map.mapObject.lng != this.map.defaultLng){
            for(let i=0; i<liveList.length; i++){
              liveList[i].distance = (this.distanceInKm(this.map.mapObject.lat,this.map.mapObject.lng, liveList[i].coordinates.lat, liveList[i].coordinates.lng));
            }
            this.liveList = liveList.sort((a, b) => {
              return a.distance - b.distance
            });
          } else {
            this.liveList = liveList.sort(function(a, b){
              if(a.restaurantName < b.restaurantName) return -1;
              if(a.restaurantName > b.restaurantName) return 1;
            })
          }

        } else if (childSnapshot.val().liveStatus == false && childSnapshot.val().stripe.subscribed == true){
          deadList.push(childSnapshot.val());
          for(let i=0; i<deadList.length; i++){

            deadList[i].address = String(deadList[i].address).split(",");
          }
          this.deadList = deadList.sort(function(a, b){
            if(a.restaurantName < b.restaurantName) return -1;
            if(a.restaurantName > b.restaurantName) return 1;
          });
        };
        return false;
      });
    } else {}
    });
  }

  switchView(){
    if(this.iconName == "list") {
      this.iconName = "map";
      this.nearMeViews = "listView";
    } else {
      this.iconName = "list";
      this.nearMeViews = "mapView";
    };
  };

  openModal(){
  };

  errToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  goToRestPage(list, index) {

    if (list == "live") {
      var restList = this.liveList;
    } else {
      var restList = this.deadList;
    }

    this.storage.get('recentCount').then((val) => {

      if (val == 0) {

        var list = [];
        list.push(restList[index]);
        this.storage.set('recentList', list);
        this.storage.set('recentCount', ++val);

      } else if (val >= 20) {

        this.storage.get('recentList').then((list) => {
          if( this.checkArrayFor( list, restList[index] ) === false ){
            list.push(restList[index]);
            list.shift();
            this.storage.set('recentList', list);
          };
        });

      } else {

        this.storage.get('recentList').then((list) => {
          if( this.checkArrayFor( list, restList[index] ) === false ){
            list.push(restList[index]);
            this.storage.set('recentList', list);
            this.storage.set('recentCount', ++val);
          };
        });

      };

    });

    this.events.publish('restaurant:viewed');
    this.navCtrl.push(RestaurantPage, restList[index]);

  };

  getDirections(lat, lng){
    this.launchNavigator.navigate([lat, lng]);
  }


  goToRestPageName(name) {

    var restList = this.liveList;
    let restaurant;

    restList.forEach((rest) => {
      if (rest.restaurantName == name ) {
        restaurant = rest;
      }
    });

    this.storage.get('recentCount').then((val) => {

      if (val == 0) {

        var list = [];
        list.push(restaurant);
        this.storage.set('recentList', list);
        this.storage.set('recentCount', ++val);

      } else if (val >= 20) {

        this.storage.get('recentList').then((list) => {
          if( this.checkArrayFor( list, restaurant ) === false ){
            list.push(restaurant);
            list.shift();
            this.storage.set('recentList', list);
          };
        });

      } else {

        this.storage.get('recentList').then((list) => {
          if( this.checkArrayFor( list, restaurant ) === false ){
            list.push(restaurant);
            this.storage.set('recentList', list);
            this.storage.set('recentCount', ++val);
          };
        });

      };

    });

    this.events.publish('restaurant:viewed');
    this.navCtrl.push(RestaurantPage, restaurant);

  };

  checkArrayFor(arr, obj) {
    for (var x = 0; x < arr.length; x++){
      if(arr[x].restaurantName === obj.restaurantName){
        return true;
      }
    }
    return false;
  };

  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  distanceInKm(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;

    var dLat = this.degreesToRadians(lat2-lat1);
    var dLon = this.degreesToRadians(lon2-lon1);

    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(10 * (earthRadiusKm * c))/10;
  }

  /*
    search bar functionality.
    Input: user input (any)
    Output: filtered list based on name or cuisine type
  */
  onSearch(event: any){
    this.setList();

    // set two local list for live and offline restaurants
    let online, offline;

    // // join livelist and deadlist to search
    // let tmpList = this.liveList.concat(this.deadList);

    // user input
    let query = event.target.value;

    if( query && query.trim() != '' ){
      // for restaurants that are currently live
      if(this.liveList){
        online = this.liveList.filter((rest) => {
          return (rest.restaurantName.toLowerCase().indexOf(query.toLowerCase()) > -1 || rest.cuisineType.toLowerCase().indexOf(query.toLowerCase()) > -1);
        })
      }
      if(this.deadList){
        // for restauarants that are currently offline
        offline = this.deadList.filter((rest) => {
          return (rest.restaurantName.toLowerCase().indexOf(query.toLowerCase()) > -1 || rest.cuisineType.toLowerCase().indexOf(query.toLowerCase()) > -1);
        })
      }
      // set livelist and deadlist to show search results
      this.liveList = online;
      this.deadList = offline;
    }

  };

  // swipe down to force pull restaurant info from firebase
  doRefresh(refresher){
    if(this.nearMeViews == "listView"){
    this.setList();

    setTimeout(() => {
      refresher.complete();
    }, 2000);

  };
}

};
