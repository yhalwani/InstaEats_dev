import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, Slides, Events, LoadingController, ToastController, Content  } from 'ionic-angular';
import { RestaurantPortalPage } from '../restaurant-portal/restaurant-portal';
import { Storage } from '@ionic/storage';
import { Stripe } from '@ionic-native/stripe';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Platform } from 'ionic-angular';
import { Intercom } from '@ionic-native/intercom';



import firebase from "firebase";

declare var window;
declare var intercom;

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
  @ViewChild('restOnSlider') restOnSlider: any;
  @ViewChild(Content) content: Content;

  slideStepOne: FormGroup;
  slideStepTwo: FormGroup;
  slideStepThree: FormGroup;

  readyToSubmit: boolean = false;

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
    public formBuilder: FormBuilder,
    public events: Events,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public stripe: Stripe,
    public camera: Camera,
    public toastCtrl: ToastController,
    public plt: Platform,
    private intercom: Intercom
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
      {type : "Fast food",      id : "14"},
      {type : "French",         id : "15"},
      {type : "Gastro",         id : "16"},
      {type : "Global",         id : "17"},
      {type : "Halal",          id : "18"},
      {type : "Indian",         id : "19"},
      {type : "Italian",        id : "20"},
      {type : "Jamaican",       id : "21"},
      {type : "Japanese",       id : "22"},
      {type : "Latin",          id : "23"},
      {type : "Mediterranean",  id : "24"},
      {type : "Mexican",        id : "25"},
      {type : "Pizzeria",       id : "26"},
      {type : "Seafood",        id : "27"},
      {type : "Steakhouse",     id : "28"},
      {type : "Sushi",          id : "29"},
      {type : "Tapas",          id : "30"},
      {type : "Thai",           id : "31"},
      {type : "Bar / Pub",      id : "32"},
      {type : "Fast food",      id : "33"}
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

    this.slideStepOne = formBuilder.group({
        restaurantName: ['', Validators.compose([Validators.maxLength(70), Validators.required])],
        email: ['', Validators.required],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });



    this.slideStepTwo = formBuilder.group({
        slogan: [''],
        description: [''],
        website: [''],
        phoneNumber: [''],
        cuisineType: ['', Validators.required],
        street: ['', Validators.compose([Validators.minLength(3), Validators.required])],
        city: ['', Validators.compose([Validators.maxLength(70), Validators.required])],
        province: ['', Validators.compose([Validators.maxLength(70), Validators.required])],
        country: ['', Validators.compose([Validators.maxLength(70), Validators.required])],
        postalCode: ['', Validators.compose([Validators.pattern('[ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVWXYZ] ?[0-9][ABCEGHJKLMNPRSTVWXYZ][0-9]'), Validators.required])],
        mon_open: [''],
        mon_close: [''],
        tues_open: [''],
        tues_close: [''],
        wed_open: [''],
        wed_close: [''],
        thurs_open: [''],
        thurs_close: [''],
        fri_open: [''],
        fri_close: [''],
        sat_open: [''],
        sat_close: [''],
        sun_open: [''],
        sun_close: [''],
        ownerName: ['', Validators.required]
    });

  }

  // Lock swipes to nav only by buttons
  ionViewDidEnter() {


    if (this.plt.is('cordova')) {
      // This will only print on a device running Cordova
        intercom.setLauncherVisibility('VISIBLE');
        intercom.registerUnidentifiedUser();
        intercom.updateUser({
          custom_attributes: {
            on_page : "mobile onboarding"
        }
      });
    } else {
      window.Intercom("boot", {
        app_id: "ns2pj54u",
        hide_default_launcher: false,
        on_page: "onboarding"
      });
    }

    this.slides.lockSwipes(true);
  }

  ionViewWillLeave() {

    if (this.plt.is('cordova')) {

      intercom.setLauncherVisibility('GONE');

    } else {
      window.Intercom("update", {
        hide_default_launcher: true
      });
    }

  }

  nextSlide(){
    this.slides.lockSwipes(false);
    this.restOnSlider.slideNext();
    this.slides.lockSwipes(true);
    this.content.scrollToTop(50);
  }

  prevSlide(){
    this.slides.lockSwipes(false);
    this.restOnSlider.slidePrev();
    this.slides.lockSwipes(true);
    this.content.scrollToTop(50);
  }


  // Finish onboarding and store data
  finish(){


  this.readyToSubmit = true;

  if(!this.slideStepOne.valid){
    this.slides.lockSwipes(false);
    this.restOnSlider.slideTo(0);
    this.slides.lockSwipes(true);
    this.content.scrollToTop(50);
  }
  else if(!this.slideStepTwo.valid){
    this.slides.lockSwipes(false);
    this.restOnSlider.slideTo(1);
    this.slides.lockSwipes(true);
    this.content.scrollToTop(50);
  }
  else {
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
      firebase.auth().createUserWithEmailAndPassword(this.slideStepOne.value.email, this.slideStepOne.value.password).then((user) => {

        let currentUser = firebase.auth().currentUser;
        let id = currentUser.uid;

        // run html5 gelocation to get user coordinates
        if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(this.setPosition); }
        this.saveImageToFirebase(this.image, id);

        // after creation push the user to realtime database using uid as key
        restRef.child(id).set({
          id: currentUser.uid,
          email: this.slideStepOne.value.email,
          restaurantName: this.slideStepOne.value.restaurantName,
          slogan: this.slideStepTwo.value.slogan,
          description: this.slideStepTwo.value.description,
          cuisineType: this.slideStepTwo.value.cuisineType,
          website: this.slideStepTwo.value.website,
          phoneNumber: this.slideStepTwo.value.phoneNumber,
          address: this.slideStepTwo.value.street + ", " + this.slideStepTwo.value.city + ", " + this.slideStepTwo.value.province + ", " + this.slideStepTwo.value.postalCode + ", " + this.slideStepTwo.value.country,
          ownersName: this.slideStepTwo.value.ownerName,
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

      if (this.plt.is('cordova')) {
        intercom.registerIdentifiedUser({
          email: this.slideStepOne.value.email,
          userId: currentUser.uid
        });
        intercom.updateUser({
          name: this.slideStepTwo.value.ownerName,
          phone: this.slideStepTwo.value.phoneNumber,
          companies: {
            id: currentUser.uid,
            name: this.slideStepOne.value.restaurantName,
            plan: 'No Plan',
            website: this.slideStepTwo.value.website,
            address: this.slideStepTwo.value.street + ", " + this.slideStepTwo.value.city + ", " + this.slideStepTwo.value.province + ", " + this.slideStepTwo.value.postalCode + ", " + this.slideStepTwo.value.country
          }
        });
      } else {
        window.Intercom("boot", {
          app_id: "ns2pj54u",
          user_id: currentUser.uid,
          name: this.slideStepTwo.value.ownerName,
          email: this.slideStepOne.value.email,
          phone: this.slideStepTwo.value.phoneNumber,
          company: {
            id: currentUser.uid,
            name: this.slideStepOne.value.restaurantName,
            plan: 'No Plan',
            website:  this.slideStepTwo.value.website,
            address:  this.slideStepTwo.value.street + ", " + this.slideStepTwo.value.city + ", " + this.slideStepTwo.value.province + ", " + this.slideStepTwo.value.postalCode + ", " + this.slideStepTwo.value.country
          },
          hide_default_launcher: false
        });
      }

        // update the display name with the username provided
        user.updateProfile({
          displayName: this.slideStepOne.value.restaurantName
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
