import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
  cuisineTypes: Array<{ type: string, id: string }>;
  provinces:   ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan",  "Yukon"]

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
  province:   any = null;
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {

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

    var ref = firebase.database().ref("/Restaurant Profiles");
    var user = firebase.auth().currentUser;
    var userId = user.uid;

    /*
        pull user info from firebase, if
        user logs in from any device that
        does not have info in its local storage
    */
    ref.child(userId).on('value', (snapshot) => {
      var data = snapshot.val();

      try{
        // variables for restaurant sign up
        this.email          = data.email;
        this.restaurantName = data.restaurantName;
        this.slogan         = data.slogan;
        this.description    = data.description;
        this.cuisineType    = data.cuisineType;
        this.website        = data.website;
        this.phoneNumber    = data.phoneNumber;

        // address info
        var arr = data.address.split(",").map((item) => item.trim());
        console.log(arr);
        this.street         = arr[0];
        this.city           = arr[1];
        this.province       = arr[2];
        this.postalCode     = arr[3];
        this.country        = arr[4];

        //hours of operation
        this.mon_open       = data.hoursOfOperation.Mon[0];
        this.mon_close      = data.hoursOfOperation.Mon[1];
        this.tues_open      = data.hoursOfOperation.Tues[0];
        this.tues_close     = data.hoursOfOperation.Tues[1];
        this.wed_open       = data.hoursOfOperation.Wed[0];
        this.wed_close      = data.hoursOfOperation.Wed[1];
        this.thurs_open     = data.hoursOfOperation.Thurs[0];
        this.thurs_close    = data.hoursOfOperation.Thurs[1];
        this.fri_open       = data.hoursOfOperation.Fri[0];
        this.fri_close      = data.hoursOfOperation.Fri[1];
        this.sat_open       = data.hoursOfOperation.Sat[0];
        this.sat_close      = data.hoursOfOperation.Sat[1];
        this.sun_open       = data.hoursOfOperation.Sun[0];
        this.sun_close      = data.hoursOfOperation.Sun[1];
        }catch(err){
          // variables for restaurant sign up
          this.email          = "email";
          this.restaurantName = "restaurantName";
          this.slogan         = "slogan";
          this.description    = "description";
          this.cuisineType    = "cuisineType";
          this.website        = "website";
          this.phoneNumber    = null ;

          // address info
          this.street         = "street";
          this.city           = "city";
          this.province       = "province";
          this.country        = "country";
          this.postalCode     = "postalCode";

        }
      });
  }

  ionViewDidEnter() {
  }

  restInfoUpdate(){
    var ref =  firebase.database().ref("/Restaurant Profiles");
    var user = firebase.auth().currentUser;
    var uid = user.uid;

    ref.child(uid).update({
      email: this.email,
      restaurantName: this.restaurantName,
      photoUrl: this.image,
      slogan: this.slogan,
      description: this.description,
      cuisineType: this.cuisineType,
      website: this.website,
      phoneNumber: this.phoneNumber,
      address: this.street + ", " + this.city + ", " + this.province + ", " + this.postalCode + ", " + this.country,
      liveStatus: false,   // false by default

      hoursOfOperation: {
        "Mon":  [this.mon_open, this.mon_close],
        "Tues": [this.tues_open, this.tues_close],
        "Wed":  [this.wed_open, this.wed_close],
        "Thurs": [this.thurs_open, this.thurs_close],
        "Fri": [this.fri_open, this.fri_close],
        "Sat": [this.sat_open, this.sat_close],
        "Sun": [this.sun_open, this.sun_close]
      }
    });
  }

  // change user password
  changePassword(newPassword){
    var user = firebase.auth().currentUser;
    user.updatePassword(newPassword).then(()=>{
      alert("Password Updated")
    })
  }

}
