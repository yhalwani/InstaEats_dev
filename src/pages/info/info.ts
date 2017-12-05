import { Component }                                  from '@angular/core';
import { NavController, NavParams, ToastController, Platform }  from 'ionic-angular';
import { Storage }                                    from '@ionic/storage';
import { Camera, CameraOptions }                      from '@ionic-native/camera';

import { User }                                       from '../../providers/user';

import firebase from 'firebase';

@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
  cuisineTypes: Array<{ type: string, id: string }>;
  provinces:   Array<{ name: string, id: string }>;

  // variables for restaurant sign up
  email:          string;
  password:       string;
  restaurantName: string;
  image:          any;
  slogan:         string;
  description:    string;
  cuisineType:    string;
  website:        string;
  phoneNumber:    number;
  ownersName:     string;
  restNumber:     number;

  // address info
  street:     any;
  city:       any;
  province:   any;
  country:    any;
  postalCode: any;

  // hours of operation
  mon_open:     any;
  mon_close:    any;
  tues_open:    any;
  tues_close:   any;
  wed_open:     any;
  wed_close:    any;
  thurs_open:   any;
  thurs_close:  any;
  fri_open:     any;
  fri_close:    any;
  sat_open:     any;
  sat_close:    any;
  sun_open:     any;
  sun_close:    any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public camera: Camera,
    public toastCtrl: ToastController,
    public userService: User,
    public platform: Platform
  ) {

    // set cuisineTypes array
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

    let ref = firebase.database().ref("/Restaurant Profiles/");
    let userId = firebase.auth().currentUser.uid;

    /*
    pull user info from firebase, if
    user logs in from any device that
    does not have info in its local storage
    */
    ref.child(userId).on('value', (snapshot) => {
      var data = snapshot.val();
      console.log(data.photoUrl)

      try{
        // variables for restaurant sign up
        this.email          = data.email;
        this.restaurantName = data.restaurantName;
        this.slogan         = data.slogan;
        this.description    = data.description;
        this.cuisineType    = data.cuisineType;
        this.website        = data.website;
        this.phoneNumber    = data.phoneNumber;
        this.image          = data.photoUrl;
        this.ownersName     = data.ownersName;
        this.restNumber     = data.restaurantNumber;

        // address info
        let arr = data.address.split(",").map((item) => item.trim());
        this.street         = arr[0];
        this.city           = arr[1];
        this.province       = arr[2];
        this.postalCode     = arr[3];
        this.country        = arr[4];

        //hours of operation
        this.mon_open       = data.hoursOfOperation.Monday[0];
        this.mon_close      = data.hoursOfOperation.Monday[1];
        this.tues_open      = data.hoursOfOperation.Tuesday[0];
        this.tues_close     = data.hoursOfOperation.Tuesday[1];
        this.wed_open       = data.hoursOfOperation.Wednesday[0];
        this.wed_close      = data.hoursOfOperation.Wednesday[1];
        this.thurs_open     = data.hoursOfOperation.Thursday[0];
        this.thurs_close    = data.hoursOfOperation.Thursday[1];
        this.fri_open       = data.hoursOfOperation.Friday[0];
        this.fri_close      = data.hoursOfOperation.Friday[1];
        this.sat_open       = data.hoursOfOperation.Saturday[0];
        this.sat_close      = data.hoursOfOperation.Saturday[1];
        this.sun_open       = data.hoursOfOperation.Sunday[0];
        this.sun_close      = data.hoursOfOperation.Sunday[1];
      }
      catch(err){
        // default to
        this.email          = "email";
        this.restaurantName = "restaurantName";
        this.slogan         = "slogan";
        this.description    = "description";
        this.cuisineType    = "cuisineType";
        this.website        = "website";
        this.phoneNumber    =  null;
        this.ownersName     = "owner's name";
        this.restNumber     = null;

        this.image          = "https://firebasestorage.googleapis.com/v0/b/instaeats-a06a3.appspot.com/o/img%2FnoImageAvailable.png?alt=media&token=d30f37e9-c408-4da9-b911-dfe411d34cbe"

        this.street         = "street";
        this.city           = "city";
        this.province       = "province";
        this.country        = "country";
        this.postalCode     = "postalCode";
      }
    });
  }

  ionViewDidEnter() {
    let web = document.getElementById("web");
    let device = document.getElementById("device");
    if(this.platform.is('core')){
      web.style.display = "block";
      device.style.display = 'none'
    } else {
      device.style.display = "block";
      web.style.display = 'none'
    }
  }

  restInfoUpdate(){
    let ref =  firebase.database().ref("/Restaurant Profiles");
    let user = firebase.auth().currentUser;
    let uid = user.uid;

    ref.child(uid).update({
      email: this.email,
      restaurantName: this.restaurantName,
      // photoUrl: this.image,
      slogan: this.slogan,
      description: this.description,
      cuisineType: this.cuisineType,
      website: this.website,
      phoneNumber: this.phoneNumber,
      restaurantNumber: this.restNumber,
      ownersName: this.ownersName,
      address: this.street + ", " + this.city + ", " + this.province + ", " + this.postalCode.toUpperCase() + ", " + this.country,
      hoursOfOperation: {
        "Monday":     [this.mon_open, this.mon_close],
        "Tuesday":    [this.tues_open, this.tues_close],
        "Wednesday":  [this.wed_open, this.wed_close],
        "Thursday":   [this.thurs_open, this.thurs_close],
        "Friday":     [this.fri_open, this.fri_close],
        "Saturday":   [this.sat_open, this.sat_close],
        "Sunday":     [this.sun_open, this.sun_close]
      }
    }).then(() => {
      let toast = this.toastCtrl.create({
        message: "Update successful",
        duration: 3000,
        position: 'bottom'
      })
      toast.present();

    })
  }

  // change user password
  changePassword(newPassword){
    let user = firebase.auth().currentUser;
    user.updatePassword(newPassword).then(()=>{
      alert("Password Updated")
    })
  }

  uploadFile(event){
    let user = firebase.auth().currentUser;
    let uid = user.uid;

    if(event.target.files && event.target.files[0]){
      this.image = event.target.files[0];
      this.saveImageToFirebase(this.image, uid);
    }
    else{}
  }

  // Fetch Img from Device
  addImg(){

    let user = firebase.auth().currentUser;
    let uid = user.uid;

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
      this.saveImageToFirebase(imageData, uid);
    }, (err) => {
      // Handle error
      this.toastCtrl.create({
        message: err,
        duration: 3000,
        position: 'bottom'
      }).present();
    });
  }

  saveImageToFirebase(imageFile, id){
    // upload image under images folder/filename
    let storageRef = firebase.storage().ref("Restaurants/" + id).child("logo_" + this.restaurantName);
    let task;


    if(this.platform.is('core')){
      task = storageRef.put(imageFile);
    } else {
      task = storageRef.putString(imageFile, 'base64');
    }

    // upload task events of type (next, error, completion)
    task.on('state_changed', null, function(err){
      let url = firebase.auth().currentUser.photoURL;

      // push to database
      firebase.database().ref('/Restaurant Profiles/').child(id).update({
        photoUrl: url
      });
    }, function(){
      let downloadURL = task.snapshot.downloadURL;

      // push to database
      firebase.database().ref('/Restaurant Profiles/').child(id).update({
        photoUrl: downloadURL
      });

    })
    let toast = this.toastCtrl.create({
      message: "Image upload success",
      duration: 3000,
      position: 'bottom'
    })
    toast.present();
  }

}
