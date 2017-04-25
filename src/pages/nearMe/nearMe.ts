import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestaurantPage } from '../restaurant-page/restaurant-page'
import firebase from 'firebase';

declare var google;

@Component({
  selector: 'page-nearMe',
  templateUrl: 'nearMe.html'
})
export class NearMePage {

  restList: Array<{blurb: any, imgURL: string, liveStatus: boolean, restaurantName: any}>;
  nearMeViews: string = "listView";
  //@ViewChild('map') mapElement: ElementRef;
  // map : any;

  constructor(public navCtrl: NavController) {

    // let latLng = new google.maps.LatLng(-34.9290, 138.6010);
    //
    // let mapOptions = {
    //   center: latLng,
    //   zoom: 15,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP
    // }
    //
    // this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var restRef = firebase.database().ref("Restaurant Profiles/");;

    restRef.orderByChild("liveStatus").equalTo(true).once("value", (snapshot) => {
      var restaurantList = [];
      snapshot.forEach( (childSnapshot) => {
        restaurantList.push(childSnapshot.val());
        this.restList = restaurantList;
        return false;
      });
    });

  }

  goToRestPage(index){
    console.log(this.restList[index]);
    this.navCtrl.push(RestaurantPage, this.restList[index]);
  }

}
//$ ionic plugin add cordova-plugin-googlemaps --variable API_KEY_FOR_ANDROID="AIzaSyCnsnRnjlqsMRO4jQLwFk3HzH8r-eMDiNk" --variable API_KEY_FOR_IOS="AIzaSyCnsnRnjlqsMRO4jQLwFk3HzH8r-eMDiNk"
//$ npm install --save @ionic-native/google-maps
