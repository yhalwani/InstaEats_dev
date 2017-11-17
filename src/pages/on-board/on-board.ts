import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, Events, LoadingController, ToastController, Content, Platform  } from 'ionic-angular';
import { RestaurantPortalPage } from '../restaurant-portal/restaurant-portal';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import firebase from "firebase";


@Component({
  selector: 'page-on-board',
  templateUrl: 'on-board.html',
})
export class OnBoardPage {
  isDisabled: boolean = true;

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
  ownerName:      string = null;

  // Address info
  street:     any = null;
  city:       any = null;
  province:   any = null;
  postalCode: any = null;
  country:    any = null;

  // Hours of operation
  mon_open:     any = "--:--";
  mon_close:    any = "--:--";
  tues_open:    any = "--:--";
  tues_close:   any = "--:--";
  wed_open:     any = "--:--";
  wed_close:    any = "--:--";
  thurs_open:   any = "--:--";
  thurs_close:  any = "--:--";
  fri_open:     any = "--:--";
  fri_close:    any = "--:--";
  sat_open:     any = "--:--";
  sat_close:    any = "--:--";
  sun_open:     any = "--:--";
  sun_close:    any = "--:--";

  // Slides reference
  @ViewChild(Slides) slides: Slides;
  @ViewChild(Content) content: Content;

  // Rest of variables
  cuisineTypes: Array<{ type: string, id: string }>;
  provinces:   Array<{ name: string, id: string }>;

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
    public camera: Camera,
    public toastCtrl: ToastController,
    private iab: InAppBrowser,
    public platform: Platform
  ) {

    // Set cuisineTypes array
    this.cuisineTypes = [
      {type : "American",       id : "1"},
      {type : "Asian",          id : "2"},
      {type : "Bar / Pub",      id : "3"},
      {type : "Barbecue",       id : "4"},
      {type : "British",        id : "5"},
      {type : "Burgers",        id : "6"},
      {type : "Canadian",       id : "7"},
      {type : "Caribbean",      id : "8"},
      {type : "Chinese",        id : "9"},
      {type : "Comfort Food",   id : "10"},
      {type : "Contemporary",   id : "11"},
      {type : "Continental",    id : "12"},
      {type : "Creperie",       id : "13"},
      {type : "European",       id : "14"},
      {type : "Fast food",      id : "15"},
      {type : "French",         id : "16"},
      {type : "Gastro",         id : "17"},
      {type : "Global",         id : "18"},
      {type : "Halal",          id : "19"},
      {type : "Indian",         id : "20"},
      {type : "Italian",        id : "21"},
      {type : "Jamaican",       id : "22"},
      {type : "Japanese",       id : "23"},
      {type : "Latin",          id : "24"},
      {type : "Mediterranean",  id : "25"},
      {type : "Mexican",        id : "26"},
      {type : "Pizzeria",       id : "27"},
      {type : "Seafood",        id : "28"},
      {type : "Steakhouse",     id : "29"},
      {type : "Sushi",          id : "30"},
      {type : "Tapas",          id : "31"},
      {type : "Thai",           id : "32"},
    ];

    // set province array
    this.provinces = [
      {name : "Alberta",                   id : "1"},
      {name : "British Columbia",          id : "2"},
      {name : "Manitoba",                  id : "3"},
      {name : "New Brunswick",             id : "4"},
      {name : "Newfoundland and Labrador", id : "5"},
      {name : "Northwest Territories",     id : "6"},
      {name : "Nova Scotia",               id : "7"},
      {name : "Nunavut",                   id : "8"},
      {name : "Ontario",                   id : "9"},
      {name : "Prince Edward Island",      id : "10"},
      {name : "Quebec",                    id : "11"},
      {name : "Saskatchewan",              id : "12"},
      {name : "Yukon",                     id : "13"}
    ];

    // Set empty menuGroup
    this.menuGroup = [];

  }

  // Lock swipes to nav only by buttons
  ionViewDidEnter() {
    this.slides.lockSwipes(true);
  }

  nextSlide(){
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
    this.content.scrollToTop(50);
  }

  prevSlide(){
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
    this.content.scrollToTop(50);
  }

  updateFinishButton(){
    this.isDisabled = !this.isDisabled;
  }

  openInAppBrowser(){
    if(this.platform.is('core')){
      const browser = this.iab.create('http://instaeats.com/terms-and-policies.html');
    }
    else{
      const browser = this.iab.create('http://instaeats.com/terms-and-policies.html', '_self');
    }
  }

  // Finish onboarding and store data
  finish(){

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

    var restRef = firebase.database().ref("/Restaurant Profiles");

    // create account using email and password
    firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then((user) => {

      let currentUser = firebase.auth().currentUser;
      let id = currentUser.uid;

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
        address: this.street + ", " + this.city + ", " + this.province + ", " + this.postalCode + ", " + this.country,
        ownersName: this.ownerName,
        liveStatus: false,   // false by default
        stripe:{
          "plan" : "none",
          "subscribed": false
        },

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

      user.sendEmailVerification().then(() => {
        this.toastCtrl.create({
          message: "Verfication email sent to your email account",
          duration: 3000,
          position: 'bottom'
        }).present();
      }).catch((error) => {console.log(error)})

      // Push menu to firebase
      this.pushMenu(id);
    });

    // Nav to Restaurant Portal
    this.presentLoading();

  }


  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Sign up successful! Please wait...",
    });
    loader.present();

    setTimeout(() => {
      // Nav to Restaurant Portal
      this.events.publish('restaurant:loggedIn', true, this.username);
      this.navCtrl.setRoot(RestaurantPortalPage);
    }, 2000);

    setTimeout(() => {
      loader.dismiss();
    }, 4000);

  };


  // Get LAT/LNG via address
  setPosition(position){
    let userId = firebase.auth().currentUser.uid;

    // push users coordinates onto firebase real-time database
    firebase.database().ref("/Restaurant Profiles").child(userId).update({
      coordinates: {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
    }).then(() => {
      console.log("Current user's location has been added to profile");
    });
  }

  saveImageToFirebase(imageFile, id){
    // upload image under images folder/filename
    var storageRef = firebase.storage().ref();
    if(imageFile){
      storageRef.child("img/" + this.restaurantName).putString(imageFile, 'base64', {contentType: 'image/png'}).then((snapshot) => {
        // this is the url for the image uploaded in firebase storage
        var imgUrl = snapshot.downloadURL;
        firebase.database().ref('/Restaurant Profiles/').child(id).update({
          photoUrl: imgUrl
        });
      });
    }else{
      // TODO: have a proper error handler
      console.log("image upload failed: invalid file")
    }
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
  pushMenu(uid){
    var menuNode = firebase.database().ref("MenuItems");
    var length = this.menuGroup.length;

    var childNode = menuNode.child(uid);
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
