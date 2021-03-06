import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, Slides, Events, LoadingController, ToastController, Content, Platform  } from 'ionic-angular';
import { RestaurantPortalPage } from '../restaurant-portal/restaurant-portal';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Intercom } from '@ionic-native/intercom';

import firebase from "firebase";

declare var window;
declare var intercom;

import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-on-board',
  templateUrl: 'on-board.html',
})
export class OnBoardPage {
  isDisabled: boolean = true;
  tmp_image: any = null;

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
  ownerName:      string = null;
  phoneNumber:    number = null;
  restNumber:     number = null;

  // Address info
  street:     any = null;
  city:       any = null;
  province:   any = null;
  postalCode: any = null;
  country:    any = null;

  // Hours of operation
  mon_open:     any = "closed";
  mon_close:    any = "closed";
  tues_open:    any = "closed";
  tues_close:   any = "closed";
  wed_open:     any = "closed";
  wed_close:    any = "closed";
  thurs_open:   any = "closed";
  thurs_close:  any = "closed";
  fri_open:     any = "closed";
  fri_close:    any = "closed";
  sat_open:     any = "closed";
  sat_close:    any = "closed";
  sun_open:     any = "closed";
  sun_close:    any = "closed";

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
    public camera: Camera,
    public toastCtrl: ToastController,
    private intercom: Intercom,
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
      restNumber: [''],
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

    let web = document.getElementById("web");
    let device = document.getElementById("device");

    if(this.platform.is('core')){
      web.style.display = "block";
      device.style.display = "none";
      window.Intercom("boot", {
        app_id: "ns2pj54u",
        hide_default_launcher: false,
        on_page: "onboarding"
      });
    }
    if(this.platform.is('mobile')) {
      device.style.display = "block";
      web.style.display = "none";
      // This will only print on a device running Cordova
      intercom.setLauncherVisibility('VISIBLE');
      intercom.registerUnidentifiedUser();
      intercom.updateUser({
        custom_attributes: {
          on_page : "mobile onboarding"
        }
      });
    }

    this.slides.lockSwipes(true);
  }

  ionViewWillLeave() {

    if (this.platform.is('cordova')) {

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
        restNumber:       this.restNumber,
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
          restaurantNumber: this.slideStepTwo.value.restNumber,
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

      if (this.platform.is('cordova')) {
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

  uploadFile(event){
    if(event.target.files && event.target.files[0]){
      this.image = event.target.files[0];

      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      if(event.target.files[0]){
        reader.onloadend = ((event) => {
          this.tmp_image = (<FileReader>event.target).result;
        });
      } else {}

    }

    else{}
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

  saveImageToFirebase(imageFile, id){
    // upload image under images folder/filename
    let storageRef = firebase.storage().ref("Restaurants/" + id).child("logo_" + this.restaurantName);
    let dbRef = firebase.database().ref('/Restaurant Profiles/').child(id);

    if(imageFile){
      if(this.platform.is('core')){
        storageRef.put(imageFile).then((snapshot) => {
          // this is the url for the image uploaded in firebase storage
          let imgUrl = snapshot.downloadURL;
          dbRef.update({
            photoUrl: imgUrl
          });
        });
      } else {
        storageRef.putString(imageFile, 'base64').then((snapshot) => {
          // this is the url for the image uploaded in firebase storage
          let imgUrl = snapshot.downloadURL;
          dbRef.update({
            photoUrl: imgUrl
          });
        });
      }
    }else{
      dbRef.update({
        photoUrl: "https://firebasestorage.googleapis.com/v0/b/instaeats-a06a3.appspot.com/o/img%2Fnoimage.jpg?alt=media&token=7e26cbbe-d8dc-4592-b670-81b0d9d6a919"
      });
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
