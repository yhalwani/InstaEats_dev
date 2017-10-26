import { Component, ViewChild, ElementRef }                                 from '@angular/core';
import {  NavController, ViewController, ModalController, AlertController } from 'ionic-angular';
import { IonicPage, NavParams, Events, Content }                            from 'ionic-angular';
import { Storage }                                                          from '@ionic/storage';

import { SocialSharing }                                                    from '@ionic-native/social-sharing';
import { LaunchNavigator, LaunchNavigatorOptions }                          from '@ionic-native/launch-navigator';

import { User }                                                             from '../../providers/user';

import firebase from 'firebase';

declare let google;

@IonicPage({
  segment: 'Restaurant/:this.restaurantName'
})
@Component({
  selector: 'page-restaurant-page',
  templateUrl: 'restaurant-page.html',
})
export class RestaurantPage {

  heartIcon: any;

  restaurant : any;
  restaurantName: string;
  restaurantStatus: boolean;

  @ViewChild(Content) content: Content;
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
    total:                 number,
    totalDiscount:         number,
    totalPercent:          number,
    timeStarted:           any,
    duration:              any,
    ongoing:               string,
    countDown:             {intvarlID: any, hours: any, minutes: any, seconds: any},
    bundleElem:            Array<{
      menuGroupName:       string,
      menu:                Array<{
        name: string, description: string, price: number, checked: boolean, discount: number, percent: number
      }>
    }>
  }>

  // variables for map and navigation
  mapIcon: string;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public storage: Storage,
    public events: Events,
    private socialSharing: SocialSharing,
    private launchNavigator: LaunchNavigator,
    public userService: User
  ) {

    this.userService.updataBundleStatus();

    this.storage.get('favList').then((list) => {

      let found = false;
      for (var x = 0; x < list.length; x++){
        if(list[x].restaurantName === this.navParams.data.restaurantName){
          this.heartIcon = "heart";
          found = true;
        };
      };

      // if restaurant is not favourited change icon to outline
      if (found == false) {
        this.heartIcon = "heart-outline";
      };

    });

    this.heartIcon = "heart-outline";
    this.restaurant = this.navParams.data;
    this.restaurantName = this.restaurant.restaurantName;
    this.restaurantStatus = this.restaurant.liveStatus;
    let restaurantUID = this.restaurant.id;

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

    if(this.restaurantStatus){
      this.mapIcon = "https://firebasestorage.googleapis.com/v0/b/instaeats-a06a3.appspot.com/o/img%2Flivelist.png?alt=media&token=6817a0b1-03cb-41b8-b026-8f51320c9100";
      var bundlesArr = [];
      var bundleNode = firebase.database().ref("/Bundles/" + restaurantUID);
      bundleNode.orderByChild("live").equalTo(true).once('value', (snapshot) => {

        // retrieve bundle from firabase and populate the restaurant page for users to see
        snapshot.forEach( (childSnapshot) => {

          bundlesArr.push(childSnapshot.val());
          this.Bundles = bundlesArr;
          return false;

        });

        this.Bundles.forEach((bundle, bundleIndex) => {
          var bundleTmp = {
            bundleName:       bundle.bundleName,
            bundleDescription:bundle.bundleDescription,
            total:            bundle.total,
            totalDiscount:    bundle.totalDiscount,
            totalPercent:     bundle.totalPercent,
            live:             bundle.live,
            ongoing:          bundle.ongoing,
            timeStarted:      bundle.timeStarted,
            duration:         bundle.duration,
            countDown:        {intvarlID: 0, hours: 0, minutes: 0, seconds: 0},
            bundleElem:       bundle.bundleElem
          };
          this.Bundles[bundleIndex] = bundleTmp;
        });

          this.Bundles.forEach(this.setTimers);

      });
    } else {
      this.mapIcon = "https://firebasestorage.googleapis.com/v0/b/instaeats-a06a3.appspot.com/o/img%2Fdeadlist.png?alt=media&token=8c472e53-9f39-41c9-911d-7d6da24c7097";
    }

    // load map everytime
    this.getMap();

  }

  ngOnInit(){
    // if restaurant is offline, toggle noDiscount card
    if(!this.restaurantStatus){
      document.getElementById("noDiscount").style.display = "block";
    } else {
      // restaurant is live, toggle coupons card
      document.getElementById("hasDiscount").style.display = "block";
    }
  }

  // scroll down to the menu card
  goToMenuCard(elementId){
    let yOffset = document.getElementById(elementId).offsetTop;

    this.content.scrollTo(0, yOffset, 1000);
  }

  // share the restaurant
  shareRest(restName){
    this.socialSharing.share("Checkout this deal at " + restName, null, null, "https://instaeats.com/").then(() => {
      // success
    }).catch((error) => {
      if(error === "cordova_not_available"){
        alert("This feature is not available in browser. Please download the app to share");
      } else {
        alert("Oops :( Something went wrong. Please try again");
      }
    });
      // TODO: detect recievers platform, then share platform specific link (android, iOS, browser)
  };

  // favourite a restaurant
  favRest(){

    if (this.heartIcon == "heart") {
      // publish event unfavourited
      this.events.publish('restaurant:unfavorited', this.navParams.data);
      this.heartIcon = "heart-outline"; // change the look of the icon

      // if user unfavourites a restaurant. save preference and notify user
      let alrt = this.alertCtrl.create({
        title: this.navParams.data.restaurantName,
        message: 'This restaurant has been unfavorited! You will no longer be notified if they have any discounts live!',
        buttons: ['Ok']
      });
      alrt.present();

    } else {
      // publish event favourited
      this.events.publish('restaurant:favorited', this.navParams.data);
      // if user favourites a restaurant. save preference and notify user
      this.heartIcon = "heart";

      let alrt = this.alertCtrl.create({
        title: this.navParams.data.restaurantName,
        message: 'This restaurant has been favorited! You will be notified if they have any discounts live!',
        buttons: ['Ok']
      });
      alrt.present();
    }
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
        iconUrl: this.mapIcon,
        zoom: 13
      }
    });
  };

  navigate(){
    let lat, lng;
    let rest = this.restaurant.id;
    firebase.database().ref("Restaurant Profiles/" + rest).on("value", (snapshot) => {
      lat = snapshot.val().coordinates.lat;
      lng = snapshot.val().coordinates.lng;
    });
    this.launchNavigator.navigate([lat, lng]);
  }

  setTimers(bundle){

    if(bundle.duration){
      var nowCheck = new Date().getTime() - bundle.timeStarted;

        bundle.countDown.intvarlID = setInterval(() => {
          var now = new Date().getTime();
          var diff = now - bundle.timeStarted;

          bundle.countDown.hours    = Math.floor( (bundle.duration - diff) / (1000 * 60 * 60)) + ":";
          bundle.countDown.minutes  = Math.floor(((bundle.duration - diff) % (1000 * 60 * 60)) / (1000 * 60)) + ":";
          bundle.countDown.seconds  = Math.floor(((bundle.duration - diff) % (1000 * 60)) / 1000)
        }, 1000);
      } else {
        bundle.countDown.hours = null;
        bundle.countDown.minutes = null;
        bundle.countDown.seconds = null;
      }
  }

  goToDiscount(index){
    let modal = this.modalCtrl.create(DiscountPage, this.Bundles[index]);
    modal.present();
  };

};

@Component({
  selector: 'page-DiscountPage',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
        Redeem Coupon
        </ion-title>
        <ion-buttons start>
          <button ion-button (click)="dismiss()">
            Cancel
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content style="background-color: #262323;" padding>
    <!-- Discount Card Template-->

      <ion-card [ngClass]="bundleItem.ongoing != null ? 'widget' : 'widget red'">
        <div class="top">

          <ion-item>
            <ion-icon style="font-size: xx-large; color: rgba(0, 0, 0, 0.5);" ios="ios-time" md="ios-time" item-left>
            </ion-icon>

            <p>Live</p>

            <div id="timer" style="display: block;">
              <h3 class="-bold">{{bundleItem.countDown.hours}}{{bundleItem.countDown.minutes}}{{bundleItem.countDown.seconds}}</h3>
            </div>

            <div id="tag" style="display: block">
              <h3 class="-bold">{{bundleItem.ongoing}}</h3>
            </div>

            <div item-right>
              <p text-right class="-bold" style="text-decoration: line-through;">$ {{bundleItem.total}}</p>
              <h1 class="-bold">$ {{bundleItem.totalDiscount}}</h1>
            </div>
          </ion-item>
        <ion-item>
          <h1 ion-text text-center style="color: rgba(0, 0, 0, 0.5);">{{bundleItem.bundleName}}</h1>
          <p ion-text text-center text-wrap style="color: rgba(0, 0, 0, 0.5);">{{bundleItem.bundleDescription}}</p>
        </ion-item>

        </div>

        <div class="rip"><div class="inner"></div></div>
        <div class="bottom">
          <ion-list *ngFor="let item of bundleItem.bundleElem">
            <ion-item *ngFor="let menuItem of item.menu" class="bundle-item">

              <h3 ion-text item-left class="-bold">{{menuItem.name}}</h3>
              <p *ngIf="menuItem.discount != 0" text-right class="-bold" style="text-decoration: line-through;"> $ {{menuItem.price}}</p>
              <h3 ion-text text-right class="-bold"> $ {{menuItem.discount}}</h3>

            </ion-item>
          </ion-list>
        </div>
      </ion-card>

      <h2 style="color: #3F3A38;" padding text-center> Please present this page to redeem coupon </h2>

    </ion-content>
  `
})
export class DiscountPage {

  bundleItem: {
    bundleName:            string,
    bundleDescription:     string,
    live:                  boolean,
    timeStarted:           any,
    duration:              any,
    ongoing:               string,
    countDown:             {intvarlID: any, hours: any, minutes: any, seconds: any},
    bundleElem:            Array<{
      menuGroupName:       string,
      menu:                Array<{
        name: string, description: string, price: number, checked: boolean, discount: number
      }>
    }>
  };

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    public storage: Storage,
    public events: Events
  ) {

    // Menu is assigned from the input parameter data
    this.bundleItem = this.params.data;

  };

  ionViewWillEnter(){

    let timer = document.getElementById("timer");
    let type = document.getElementById("tag");

    if(this.bundleItem.ongoing){
      if(timer.style.display === 'block'){
        timer.style.display = 'none';
        type.style.display = 'block'
      }
      else { }
    }
}

  // Close bundle page
  dismiss() {
    this.viewCtrl.dismiss();
  };


};
