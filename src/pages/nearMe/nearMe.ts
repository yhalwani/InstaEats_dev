import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestaurantPage } from '../restaurant-page/restaurant-page'
import firebase from 'firebase';
// import { GoogleMap, GoogleMaps, GoogleMapsEvent, LatLng, CameraPosition, Marker, MarkerOptions } from '@ionic-native/google-maps';

declare var google;

@Component({
  selector: 'page-nearMe',
  templateUrl: 'nearMe.html'
})
export class NearMePage {

  restList: Array<{ blurb: any, imgURL: string, liveStatus: boolean, restaurantName: any }>;
  nearMeViews: string = "listView";
  @ViewChild('map') mapElement: ElementRef;
  map : any;

  constructor(public navCtrl: NavController) {

    var restRef = firebase.database().ref("Restaurant Profiles/");;

    restRef.orderByChild("liveStatus").equalTo(true).once("value", (snapshot) => {
      var restaurantList = [];
      snapshot.forEach((childSnapshot) => {
        restaurantList.push(childSnapshot.val());
        this.restList = restaurantList;
        return false;
      });
    });

  }

  loadMap(){

    let latLng = new google.maps.LatLng(-34.9290, 138.6010);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    console.log("Clicked");

  }

  // ngAfterViewInit() {
  //   this.loadMap();
  // }
  //
  //
  // loadMap() {
  //
  //   let element: HTMLElement = document.getElementById('map');
  //   let map: GoogleMap = this.googleMaps.create(element);
  //   map.one(GoogleMapsEvent.MAP_READY).then(() => console.log('Map is ready!'));
  //
  //   // create LatLng object
  //   let ionic: LatLng = new LatLng(43.0741904, -89.3809802);
  //
  //   // create CameraPosition
  //   let position: CameraPosition = {
  //     target: ionic,
  //     zoom: 18,
  //     tilt: 30
  //   };
  //
  //   // move the map's camera to position
  //   map.moveCamera(position);
  //
  //
  // }

  goToRestPage(index) {
    console.log(this.restList[index]);
    this.navCtrl.push(RestaurantPage, this.restList[index]);
  }

}
