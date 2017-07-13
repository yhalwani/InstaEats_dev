import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, Events, LoadingController, ToastController  } from 'ionic-angular';
import { RestaurantPortalPage } from '../restaurant-portal/restaurant-portal';
import { Storage } from '@ionic/storage';
import { Stripe } from '@ionic-native/stripe';
import { Camera, CameraOptions } from '@ionic-native/camera';

import firebase from "firebase";


@Component({
  selector: 'page-on-board',
  templateUrl: 'on-board.html',
})
export class OnBoardPage {

  // Variables for restaurant sign up
  username:       any;
  email:          string;
  password:       string;
  restaurantName: string;
  image:          any = null;
  slogan:         string = null;
  description:    string = null;
  cuisineType:    string = null;
  website:        string = null;
  phoneNumber:    number = null;

  // Address info
  street:     any = null;
  city:       any = null;
  province:  any = null;
  country:    any = null;
  postalCode: any = null;

  // Hours of operation
  mon_open:     any = null;
  mon_close:    any = null;
  tues_open:    any = null;
  tues_close:   any = null;
  wed_open:     any = null;
  wed_close:    any = null;
  thurs_open:   any = null;
  thurs_close:  any = null;
  fri_open:     any = null;
  fri_close:    any = null;
  sat_open:     any = null;
  sat_close:    any = null;
  sun_open:     any = null;
  sun_close:    any = null;

  // Slides reference
  @ViewChild(Slides) slides: Slides;

  // Rest of variables
  cuisineTypes: Array<{ type: string, id: string }>;
  provinces:   ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan",  "Yukon"];

  menuGroup: Array<{
    menuGroupName: string,
    menu: Array<{
      name: string, description: string, price: number
    }>
  }>;

  // Stripe variables
  cardHolder: string;
  cardNumber: number;
  expiry:     number;
  security:   number;
  userToken: any;


  constructor(
    public navCtrl: NavController,
    public events: Events,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public stripe: Stripe,
    public camera: Camera,
    public toastCtrl: ToastController
  ) {

    // Set cuisineTypes array
    this.cuisineTypes = [
      {type : "American",       id : "1"},
      {type : "Asian",          id : "2"},
      {type : "Barbecue",       id : "3"},
      {type : "British",        id : "4"},
      {type : "Burgers",        id : "5"},
      {type : "Canadian",       id : "6"},
      {type : "Caribbean",      id : "7"},
      {type : "Chinese",        id : "8"},
      {type : "Comfort Food",   id : "9"},
      {type : "Contemporary",   id : "10"},
      {type : "Continental",    id : "11"},
      {type : "Creperie",       id : "12"},
      {type : "European",       id : "13"},
      {type : "French",         id : "14"},
      {type : "Gastro",         id : "15"},
      {type : "Global",         id : "16"},
      {type : "Indian",         id : "17"},
      {type : "Italian",        id : "18"},
      {type : "Jamaican",       id : "19"},
      {type : "Japanese",       id : "20"},
      {type : "Latin",          id : "21"},
      {type : "Mediterranean",  id : "22"},
      {type : "Mexican",        id : "23"},
      {type : "Pizzeria",       id : "24"},
      {type : "Seafood",        id : "25"},
      {type : "Steakhouse",     id : "26"},
      {type : "Sushi",          id : "27"},
      {type : "Tapas",          id : "28"},
      {type : "Thai",           id : "29"},
      {type : "Bar / Pub",      id : "30"}
    ];

    // Set empty menuGroup
    this.menuGroup = [];

  }

  // Lock swipes to nav only by buttons
  ionViewDidEnter() {
    this.slides.lockSwipes(true);
  }

  // If the slide is the first one stop lockSwipes
  ionSlideDidChange(){
    if (this.slides.getActiveIndex() === 0){
      this.slides.lockSwipes(true);
    }
  }

  // Lock swipe right and unlock swipe left
  loginInfo(){
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipeToNext(true);
  }

  generalInfo(){
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipeToNext(true);
  }

  menuInfo(){
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipeToNext(true);
  }


  // Finish onboarding and store data
  finish(){
    try{
    // Set empty JSON array for bundles
    this.storage.set('bundles', []);

    // Set empty JSON array to restInfo
    this.storage.set('restInfo', {});

    // Fetch and set variables
    var info = {
      restaurantName :  this.restaurantName,
      email :           this.email,
      slogan:           this.slogan,
      description:      this.description,
      cuisineType:      this.cuisineType,
      website:          this.website,
      phoneNumber:      this.phoneNumber,
      street:           this.street,
      city:             this.city,
      province:         this.province,
      country:          this.country,
      postalCode:       this.postalCode,
      mon_open:         this.mon_open,
      mon_close:        this.mon_close,
      tues_open:        this.tues_open,
      tues_close:       this.tues_close,
      wed_open:         this.wed_open,
      wed_close:        this.wed_close,
      thurs_open:       this.thurs_open,
      thurs_close:      this.thurs_close,
      fri_open:         this.fri_open,
      fri_close:        this.fri_close,
      sat_open:         this.sat_open,
      sat_close:        this.sat_close,
      sun_open:         this.sun_open,
      sun_close:        this.sun_close
    };

    // Store restaurant info
    this.storage.set('restInfo', info);

    // Store menu
    this.storage.set('restMenu', []);
    this.storage.set('restMenu', this.menuGroup);

    // Stripe Key
    this.stripe.setPublishableKey('pk_test_GtPPuYvc17ygIxk7JSktsyxN');

    // Trigger card addition and subscription
    let card = {
      number: this.cardNumber.toString(),
      expMonth: Number(this.expiry.toString().split("-")[1]),
      expYear: Number(this.expiry.toString().split("-")[0]),
      cvc: this.security.toString()
    };

    this.stripe.createCardToken(card)
    .then(token => console.log(token))
    //handle error
    .catch(error => console.log(error));
  } catch (err) {
    this.toastCtrl.create({
      message: err,
      duration: 3000,
      position: 'bottom'
    }).present();
  } finally {
    this.toastCtrl.create({
      message: "First stage complete",
      duration: 3000,
      position: 'bottom'
    })
  }

  try{
    var restRef = firebase.database().ref("/Restaurant Profiles");

    // create account using email and password
    firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then((user) => {

      var currentUser = firebase.auth().currentUser;
      var id = currentUser.uid;

      // run html5 gelocation to get user coordinates
      if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(this.setPosition); }
      this.saveImageToFirebase(this.image, id);

      // after creation push the user to realtime database using uid as key
      restRef.child(id).set({
        id: currentUser.uid,
        email: this.email,
        restaurantName: this.restaurantName,
        slogan: this.slogan,
        description: this.description,
        cuisineType: this.cuisineType,
        website: this.website,
        phoneNumber: this.phoneNumber,
        address: this.street + ", " + this.city + ", " + this.country + ", " + this.postalCode + ", " + this.province,
        liveStatus: false,   // false by default

        hoursOfOperation: {
          "Mon": [this.mon_open, this.mon_close],
          "Tues": [this.tues_open, this.tues_close],
          "Wed": [this.wed_open, this.wed_close],
          "Thurs": [this.thurs_open, this.thurs_close],
          "Fri": [this.fri_open, this.fri_close],
          "Sat": [this.sat_open, this.sat_close],
          "Sun": [this.sun_open, this.sun_close]
        }
      });

      // update the display name with the username provided
      user.updateProfile({
        displayName: this.restaurantName
      });

      // Push menu to firebase
      this.pushMenu(this.restaurantName);
    });

  } catch (err) {
    this.toastCtrl.create({
      message: err,
      duration: 3000,
      position: 'bottom'
    }).present();
  } finally {
    this.toastCtrl.create({
      message: "Second Stage Passed",
      duration: 3000,
      position: 'bottom'
    }).present();
  }

    // Nav to Restaurant Portal
    this.events.publish('restaurant:loggedIn', true, this.username);
    this.navCtrl.setRoot(RestaurantPortalPage);
  }

  // Get LAT/LNG via address
  setPosition(position){
    var geofire = firebase.database().ref("/geofire");

    var currentUser = firebase.auth().currentUser;
    var id = currentUser.uid;

    // push users coordinates onto firebase real-time database
    geofire.child(id).update({
      //name: this.restaurantName,
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }).then(() => {
      console.log("Current user's location has been added to GeoFire");
    });
  }

  saveImageToFirebase(imageFile, id){
    // upload image under images folder/filename
    var storageRef = firebase.storage().ref();
    storageRef.child("img/" + this.restaurantName).putString(imageFile, 'base64', {contentType: 'image/png'}).then((snapshot) => {
      // this is the url for the image uploaded in firebase storage
      var imgUrl = snapshot.downloadURL;
      firebase.database().ref('/Restaurant Profiles/').child(id).update({
        photoUrl: imgUrl
      });
    });
  }

  // Fetch Img from Device
  addImg(){

    // CameraOptions
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URL
      this.image = imageData;
    }, (err) => {
      // Handle error
      this.toastCtrl.create({
        message: err,
        duration: 3000,
        position: 'bottom'
      }).present();
    });

  }

  // Push menu to firebase
  pushMenu(name){
    var menuNode = firebase.database().ref("MenuItems");
    var length = this.menuGroup.length;

    var childNode = menuNode.child(name);
    for (var i = 0; i < length; i++) {
      childNode.update({
        [this.menuGroup[i].menuGroupName]: this.menuGroup[i].menu
      });
    }
  }

  // Add menu group to page
  addMenuGroup(){
    var menuItem = {name : "", description: "", price: 0.00};
    var menuGroupElem = {menuGroupName: "", menu: [menuItem]};
    this.menuGroup.push(menuGroupElem);
  }

  // Add menu item to group
  addMenuItem(index){
    var menuItem = {name : "", description: "", price: 0.00};
    this.menuGroup[index].menu.push(menuItem);
  }

  // Remove menu group
  removeGroup(index){
    this.menuGroup.splice(index,1);
  };

  // Remove menu item from group
  removeItem(menu, item){
    this.menuGroup[menu].menu.splice(item, 1);
  };

}
