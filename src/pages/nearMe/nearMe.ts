import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestaurantPage } from '../restaurant-page/restaurant-page'
import firebase from 'firebase';

@Component({
  selector: 'page-nearMe',
  templateUrl: 'nearMe.html'
})
export class NearMePage {

  restList: Array<{ blurb: any, imgURL: string, liveStatus: boolean, restaurantName: any }>;
  nearMeViews: string = "listView";

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


  goToRestPage(index) {
    console.log(this.restList[index]);
    this.navCtrl.push(RestaurantPage, this.restList[index]);
  }

}
