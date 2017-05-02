import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { RestaurantPage } from '../restaurant-page/restaurant-page';
import firebase from 'firebase';

@Component({
  selector: 'page-nearMe',
  templateUrl: 'nearMe.html'
})
export class NearMePage {

  restList: Array<{ blurb: any, imgURL: string, liveStatus: boolean, restaurantName: any }>;
  nearMeViews: string = "listView";
// @ViewChild('map') mapElement : ElementRef

  constructor(public navCtrl: NavController, public events: Events, public storage: Storage) {

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

  goToRestPage(index) {
    console.log(this.restList[index]);

    this.storage.get('recentCount').then((val) => {
      if (val == 0) {
        var list = [];
        list.push(this.restList[index]);
        this.storage.set('recentList', list);
        this.storage.set('recentCount', ++val);
      } else if (val >= 20) {
        this.storage.get('recentList').then((list) => {
          list.push(this.restList[index]);
          list.pop(20);
          this.storage.set('recentList', list);
        });
      } else {
        this.storage.get('recentList').then((list) => {
          list.push(this.restList[index]);
          this.storage.set('recentList', list);
          this.storage.set('recentCount', ++val);
        });
      };
    });

    this.events.publish('restaurant:viewed', this.restList[index]);
    this.navCtrl.push(RestaurantPage, this.restList[index]);
  }

}

//  ionViewDidLoad(){
//     this.loadMap();
//   }
//
//   loadMap(){
//     this.geolocation.getCurrentPosition().then((position) => {
//       let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
//       // initializing map attributes
//       let mapOptions = {
//         center: latLng,
//         zoom: 15,
//         mapTypeId: google.maps.MapTypeId.ROADMAP
//      };
//      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
//
//      // drop a marker at the users current position
//      new google.maps.Marker({
//        position: latLng,
//        map: this.map,
//        animation: google.maps.Animation.DROP
//      });
//    });
// }
