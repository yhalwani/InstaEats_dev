import { Component } from '@angular/core';
import { NavController, Events, ToastController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
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
    coordinates: Array<{name: any, lat: number, lng: number, address: string}>,
    address: string,
    distance: number
  }>;

  deadList: Array<{
    slogan: any,
    description: string,
    id: string,
    imgURL: string,
    liveStatus: boolean,
    restaurantName: any,
    coordinates: Array<{name: any, lat: number, lng: number, address: string}>,
    address: string,
    distance: number
  }>;

  // Dynamic variables that change according to
  nearMeViews: string = "listView";
  iconName: string = "map";

  _map: any;

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
  ) {

    this.loadMap();
    let restRef = firebase.database().ref("Restaurant Profiles/");

    restRef.orderByChild("liveStatus").on("value", (snapshot) => {
      let liveList  = [];
      let deadList  = [];
      let coords    = [];

      snapshot.forEach((childSnapshot) => {
        if(childSnapshot.val().liveStatus == true) {
          liveList.push(childSnapshot.val());
          for(let i=0; i<liveList.length; i++){
            liveList[i].distance = (this.distanceInKm(this._map.lat, this._map.lng, liveList[i].coordinates.lat, liveList[i].coordinates.lng));
          }
          this.liveList = liveList;

        } else if (childSnapshot.val().liveStatus == false){
          deadList.push(childSnapshot.val());
          this.deadList = deadList;
        }

        console.log(this.liveList);
        return false;
      });
    });

    if(this.plt.is('ios')){
      this.plat = { platform: "header-icon-ios", assetPath: "assets/icon/icon.png"};
    } else {
      this.plat = { platform: "header-icon-md", assetPath: "assets/icon/icon.png"};
    };

  };

  // ngOnInit(){
  //   this.loadMap();
  // };

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

  loadMap(){
    this.map.getLocationServices();
    this._map = this.map.mapObject;
  }

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

  onSearch(){
    // // create tmp list and search list. If query is in tmp list, push to search list
    // let restRef = firebase.database().ref("Restaurant Profiles/");
    // var query = this.searchInput;
    // var userQuery = restRef.orderByChild("restaurantName").startAt(query).endAt(query + '\uf8ff');
    //   userQuery.once("value", function(snapshot) {
    // var data = snapshot.val();
    // console.log(data);
    //
    // /* TODO: create a list and show as search resutls */
    //
    // }, function (errorObject) {
    // console.log("The read failed: " + errorObject.code);
    // });
  };

  // doRefresh(refresher){
  //   let restRef = firebase.database().ref("Restaurant Profiles/");
  //
  //   restRef.orderByChild("liveStatus").on("value", (snapshot) => {
  //     let liveList = [];
  //     let deadList = [];
  //     let coords = [];
  //
  //     snapshot.forEach((childSnapshot) => {
  //       if(childSnapshot.val().liveStatus == true) {
  //         liveList.push(childSnapshot.val());
  //         this.liveList = liveList;
  //       } else if (childSnapshot.val().liveStatus == false){
  //         deadList.push(childSnapshot.val());
  //         this.deadList = deadList;
  //       }
  //       return false;
  //     });
  //   });
  //
  //   setTimeout(() => {
  //     refresher.complete();
  //   }, 2000);
  //
  // };

};


// TODO:  install NativeGeocoderModules
//        import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
//        import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';\
//        add to constructor

// reverse geocode (use coordinates and return string: street address)
// geolocate(){
//   this.nativeGeocoder.reverseGeocode(this.map.lat, this.map.lng)
//   .then((result: NativeGeocoderReverseResult) =>
//   {let msg = result.street + result.countryCode;
//   this.toast(msg)})
//   .catch((error: any) => console.log(error));
// }
