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
  local_map: any;

  menuGroup: Array<{
    menuGroupName: string,
    menu: Array<{
      name: string, description: string, price: number
    }>
  }>;

  Bundles: Array<{
    bundleName:            string,
    bundleDescription:     string,
    live:                  boolean,
    timeStarted:           any,
    duration:              any,
    countDown:             {intvarlID: any, hours: any, minutes: any, seconds: any},
    bundleElem:            Array<{
      menuGroupName:       string,
      menu:                Array<{
        name: string, description: string, price: number, checked: boolean, discount: number
      }>
    }>
  }>

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public events: Events
  ) {
    this.restaurant = this.navParams.data;
    let restaurantUID = this.restaurant.id;

    // load map everytime
    this.getMap();

    var menuArr = [];

    firebase.database().ref('/MenuItems/' + restaurantUID).once("value", (snapshot) => {
      var data = snapshot.val();

      for (var menuG in data){
        var menuGE = {menuGroupName: menuG, menu: []};

        snapshot.child(menuG).forEach((childSnapshot) => {
          var childData = childSnapshot.val();
          var menuI = {name: childData.name, description: childData.description, price: childData.price};
          menuGE.menu.push(menuI);
          return false;
        });
        menuArr.push(menuGE);
      }

      this.storage.set('restMenu', menuArr);
      this.menuGroup = menuArr;

    });

    var bundlesArr = [];
    var bundleNode = firebase.database().ref("/Bundles/" + restaurantUID);
    bundleNode.orderByChild("live").equalTo(true).once('value', (snapshot) => {

      // retrieve bundle from firabase and populate the restaurant page for users to see
      snapshot.forEach( (childSnapshot) => {
        var bundle = {
          bundleName: childSnapshot.key,
          bundleDescription:"",
          live: false,
          timeStarted: 0,
          duration: 0,
          countDown: {intvarlID: 0, hours: 0, minutes: 0, seconds: 0},
          bundleElem: []
        }
        childSnapshot.forEach((childSnapshot) => {
          if (childSnapshot.key == "description"){
            bundle.bundleDescription = childSnapshot.val();
          } else if (childSnapshot.key == "live") {
            bundle.live = childSnapshot.val();
          } else if (childSnapshot.key == "startedAt") {
            bundle.timeStarted = childSnapshot.val();
          } else if (childSnapshot.key == "duration") {
            bundle.duration = childSnapshot.val();
          } else {
            childSnapshot.forEach((childSnapshot) => {
              var bundleE = {menuGroupName:"", menu: []};
              childSnapshot.forEach((childSnapshot) => {
                if(childSnapshot.key == "menuGroupName"){
                  bundleE.menuGroupName = childSnapshot.val();
                } else {
                  childSnapshot.forEach((childSnapshot) => {
                    var tmp = childSnapshot.val();
                    var menu = {
                      name:         tmp.name,
                      description:  tmp.description,
                      price:        tmp.price,
                      checked:      tmp.checked,
                      discount:     tmp.discount
                    };
                    bundleE.menu.push(menu);
                    return false;
                  })
                };
                return false;
              });
              bundle.bundleElem.push(bundleE);
              return false;
            });
          };
          return false;
        });
        bundlesArr.push(bundle);
        return false;
      });
      this.Bundles = bundlesArr;
      this.Bundles.forEach(this.setTimers);
    });

  }

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
  };

  checkArrayFor(arr, obj){
    for (var x = 0; x < arr.length; x++){
      if(arr[x].restaurantName === obj.restaurantName){
        return true;
      }
    }
    return false;
  };

  // populate map with correct restaurant location
  getMap(){
    let rest = this.restaurant.id;
    firebase.database().ref("Restaurant Profiles/" + rest).on("value", (snapshot) => {
      let data = snapshot.val();
      this.local_map = {
        name: data.restaurantName,
        address: data.address,
        lat: data.coordinates.lat,
        lng: data.coordinates.lng,
        iconUrl: "https://firebasestorage.googleapis.com/v0/b/instaeats-a06a3.appspot.com/o/img%2FinstaEats%20(1).png?alt=media&token=ffe75fcb-6b25-416c-9013-04112f5be2bc",
        zoom: 13,
      }
    });
  };

  setTimers(bundle){

    var nowCheck = new Date().getTime() - bundle.timeStarted;

    if ( nowCheck > bundle.duration ) {
      clearInterval(bundle.countDown.intvarlID);
      bundle.countDown.hours = 0;
      bundle.countDown.minutes = 0;
      bundle.countDown.seconds = 0;
    } else {
      bundle.countDown.intvarlID = setInterval(() => {
        var now = new Date().getTime();
        var diff = now - bundle.timeStarted;

        bundle.countDown.hours = Math.floor((bundle.duration - diff) / (1000 * 60 * 60));
        bundle.countDown.minutes =  Math.floor(((bundle.duration - diff) % (1000 * 60 * 60)) / (1000 * 60));
        bundle.countDown.seconds = Math.floor(((bundle.duration - diff) % (1000 * 60)) / 1000)
      }, 1000);
    };

  };


}
