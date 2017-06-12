import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, Events, LoadingController  } from 'ionic-angular';
import { RestaurantPortalPage } from '../restaurant-portal/restaurant-portal';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-on-board',
  templateUrl: 'on-board.html',
})
export class OnBoardPage {

  // Variables for restaurant sign up
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
  state:      any = null;
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
  menuGroup: Array<{
    menuGroupName: string,
    menu: Array<{name: string, description: string, price: number}>
  }>;
  username: any;

  constructor(
    public navCtrl: NavController,
    public events: Events,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public storage: Storage
  ) {

    // Set cuisineTypes array
    this.cuisineTypes = [
      {type : "American",     id : "1"},
      {type : "Asian",        id : "2"},
      {type : "Barbecue",     id : "3"},
      {type : "British",      id : "4"},
      {type : "Burgers",      id : "5"},
      {type : "Canadian",     id : "6"},
      {type : "Caribbean",    id : "7"},
      {type : "Chinese",      id : "8"},
      {type : "Comfort Food", id : "9"},
      {type : "Contemporary", id : "10"},
      {type : "Continental",  id : "11"},
      {type : "Creperie",     id : "12"},
      {type : "European",     id : "13"},
      {type : "French",       id : "14"},
      {type : "Gastro",       id : "15"},
      {type : "Global",       id : "16"},
      {type : "Indian",       id : "17"},
      {type : "Italian",      id : "18"},
      {type : "Jamaican",     id : "19"},
      {type : "Japanese",     id : "20"},
      {type : "Latin",        id : "21"},
      {type : "Mediterranean", id : "22"},
      {type : "Mexican",      id : "23"},
      {type : "Pizzeria",     id : "24"},
      {type : "Seafood",      id : "25"},
      {type : "Steakhouse",   id : "26"},
      {type : "Sushi",        id : "27"},
      {type : "Tapas",        id : "28"},
      {type : "Thai",         id : "29"},
      {type : "Bar / Pub",    id : "30"}
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
      state:            this.state,
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

      var currentUser = firebase.auth().currentUser;
      var id = currentUser.uid;

      // run html5 gelocation to get user coordinates
      if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(this.setPosition); }
      // after creation push the user to realtime database using uid as key
      restRef.child(id).set({
        email: this.email,
        displayName: this.restaurantName,
        photoUrl: this.image,
        slogan: this.slogan,
        description: this.description,
        cuisineType: this.cuisineType,
        website: this.website,
        phoneNumber: this.phoneNumber,
        address: this.street + ", " + this.city + ", " + this.country + ", " + this.postalCode + ", " + this.state,
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
      this.pushMenu(this.restaurantName);
    });

    // Nav to portal
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

}
