import { Component } from '@angular/core';
import { NavController, Events, ToastController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { RestaurantPage } from '../restaurant-page/restaurant-page';
import firebase from 'firebase';

@Component({
  selector: 'page-nearMe',
  templateUrl: 'nearMe.html'
})
export class NearMePage {

  restList: Array<{
    slogan: any,
    description: string,
    id: string,
    imgURL: string,
    liveStatus: boolean,
    restaurantName: any
  }>;

  nearMeViews: string = "listView";
  iconName: string = "map";

  locations: Array<{name: any, lat: number, lng: number, address: string}>;
  map: any;

  // TODO: get input from the slider and pass as radius to create circle
  minLimit: number = 0;  // 0 km
  maxLimit: number = 100000; // 100 km
  distance: number = 5000;  // default radius 5 km

  plat: any;

  constructor(
    public navCtrl: NavController,
    public events: Events,
    public storage: Storage,
    public toastCtrl: ToastController,
    public plt: Platform
  ) {

    let restRef = firebase.database().ref("Restaurant Profiles/");

    restRef.orderByChild("liveStatus").equalTo(true).on("value", (snapshot) => {
      let restaurantList = [];
      let coords = [];
      snapshot.forEach((childSnapshot) => {
        restaurantList.push(childSnapshot.val());
        this.restList = restaurantList;

        // get coordinates of live restauarants only
        let data = childSnapshot.val();
        let obj = {name: data.restaurantName, lat: data.coordinates.lat, lng: data.coordinates.lng, address: data.address};
        coords.push(obj);
        this.locations = coords;

        return false;
      });
    });

    if(this.plt.is('ios')){
      this.plat = "header-icon-ios";
    } else {
      this.plat = "header-icon-md";
    };

    // TODO: Make two lists. One for live restaurants and second for offline restaurant
    // get coordinates of all
    // for live restaurants have red markers
    // for offline restaurants have gray markers

  };

  doRefresh(refresher){
    let restRef = firebase.database().ref("Restaurant Profiles/");

    restRef.orderByChild("liveStatus").equalTo(true).on("value", (snapshot) => {
      let restaurantList = [];
      let coords = [];

      snapshot.forEach((childSnapshot) => {
        restaurantList.push(childSnapshot.val());
        this.restList = restaurantList;

        // get coordinates of live restauarants only
        let data = childSnapshot.val();
        let obj = {name: data.restaurantName, lat: data.coordinates.lat, lng: data.coordinates.lng, address: data.address};
        coords.push(obj);
        this.locations = coords;

        return false;
      });

    });

    setTimeout(() => {
      refresher.complete();
    }, 2000);

  };

  ngOnInit() {
    this.loadMap();
  };

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
  }

  loadMap(){
    // // Set user location
    // if(!navigator.geolocation){
    //
    //   // if (error.code == error.PERMISSION_DENIED)
      this.map = {
        // location of development
        lat: 43.6011579,
        lng: -79.64162270000001,
        zoom: 8,
        iconUrl: "https://firebasestorage.googleapis.com/v0/b/instaeats-a06a3.appspot.com/o/img%2FinstaEats%20(1).png?alt=media&token=ffe75fcb-6b25-416c-9013-04112f5be2bc"
      };

    // } else {
    //
    //   navigator.geolocation.getCurrentPosition((position) => {
    //
    //     this.map = {
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude,
    //       zoom: 11,
    //       iconUrl: "https://firebasestorage.googleapis.com/v0/b/instaeats-a06a3.appspot.com/o/img%2FinstaEats%20(1).png?alt=media&token=ffe75fcb-6b25-416c-9013-04112f5be2bc"
    //     };
    //
    //   });
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

  goToRestPage(index) {

    this.storage.get('recentCount').then((val) => {

      if (val == 0) {

        var list = [];
        list.push(this.restList[index]);
        this.storage.set('recentList', list);
        this.storage.set('recentCount', ++val);

      } else if (val >= 20) {

        this.storage.get('recentList').then((list) => {
          if( this.checkArrayFor( list, this.restList[index] ) === false ){
            list.push(this.restList[index]);
            list.shift();
            this.storage.set('recentList', list);
          };
        });

      } else {

        this.storage.get('recentList').then((list) => {
          if( this.checkArrayFor( list, this.restList[index] ) === false ){
            list.push(this.restList[index]);
            this.storage.set('recentList', list);
            this.storage.set('recentCount', ++val);
          };
        });

      };

    });

    this.events.publish('restaurant:viewed');
    this.navCtrl.push(RestaurantPage, this.restList[index]);

  };

  checkArrayFor(arr, obj) {
    for (var x = 0; x < arr.length; x++){
      if(arr[x].restaurantName === obj.restaurantName){
        return true;
      }
    }
    return false;
  };

};
