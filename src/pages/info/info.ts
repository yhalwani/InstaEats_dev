import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {

  // variables for restaurant sign up
  email:          string;
  password:       string;
  restaurantName: string;
  image:          any = null;
  slogan:         string = null;
  description:    string = null;
  cuisineType:    string = null;
  website:        string = null;
  phoneNumber:    number = null;

  // address info
  street:     any = null;
  city:       any = null;
  state:      any = null;
  country:    any = null;
  postalCode: any = null;

  //hours of operation
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

  userData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    var user = firebase.auth().currentUser;

    /*
       To pull user info from firebase, if
       user logs in from any device that 
       does not have info in its local storage
    */
    firebase.database().ref("/Restaurant Profiles" + user.uid).on('value', (snapshot) => {
      var data = snapshot.val();
      this.userData = data;
    });

    this.storage.get('restInfo').then((list) => {

      // variables for restaurant sign up
      this.email          = list.email;
      this.restaurantName = list.restaurantName;
      this.slogan         = list.slogan;
      this.description    = list.description;
      this.cuisineType    = list.cuisineType;
      this.website        = list.website;
      this.phoneNumber    = list.phoneNumber;

      // address info
      this.street         = list.street;
      this.city           = list.city;
      this.state          = list.state;
      this.country        = list.country;
      this.postalCode     = list.postalCode;

      //hours of operation
      this.mon_open       = list.mon_open;
      this.mon_close      = list.mon_close;
      this.tues_open      = list.tues_open;
      this.tues_close     = list.tues_close;
      this.wed_open       = list.wed_open;
      this.wed_close      = list.wed_close;
      this.thurs_open     = list.thurs_open;
      this.thurs_close    = list.thurs_close;
      this.fri_open       = list.fri_open;
      this.fri_close      = list.fri_close;
      this.sat_open       = list.sat_open;
      this.sat_close      = list.sat_close;
      this.sun_open       = list.sun_open;
      this.sun_close      = list.sun_close;
    })

  }

  ionViewDidLoad() {
  }

  restInfoUpdate(){
    var ref =  firebase.database().ref("/Restaurant Profiles");
    var user = firebase.auth().currentUser;
    var uid = user.uid;

    ref.child(uid).update({
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

  }

  updateUserPassword(newPassword){
    var user = firebase.auth().currentUser;
    user.updatePassword(newPassword).then(()=>{
      alert("Password Updated")
    })
  }

}
