import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Platform } from 'ionic-angular';
import { Events, LoadingController, ToastController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';


@Injectable()
export class Map {

  mapObject : {
    lat: number,
    lng: number,
    zoom: number,
    visible: boolean,
    iconUrl: string
  };

  constructor(public platform: Platform, private geolocation: Geolocation, private diagnostic: Diagnostic, public toastCtrl: ToastController) {
    this.mapObject = {
      // (default)
      lat: 45.216612,
      lng: -82.523330,
      zoom: 5,
      visible: false,
      iconUrl: ""
    }
  }

  getLocationServices(){
    if(this.platform.is('core')){
      // Set user location using html5 geolocation
      navigator.geolocation.getCurrentPosition((position) => {
          this.mapObject = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            zoom: 13,
            visible: true,
            iconUrl: "https://firebasestorage.googleapis.com/v0/b/test1-51a17.appspot.com/o/img%2Fbluedot.png?alt=media&token=9315039e-df6d-4862-9cf1-4087482e4713"
          };
        },(error) => {
          if(error.code == error.PERMISSION_DENIED){
            this.errToast("Location Services denied permission")
          }
        });
    }else{
      // check if device location is turned on
      this.diagnostic.isLocationEnabled().then((isAvailable) => {
        if(isAvailable == true){
          this.getLocation();
        }
        else{
          // this.openNativeSettings.open("location");
          this.diagnostic.switchToLocationSettings();
        }
        // this.getLocation();
      }).then(() => {
        if(this.diagnostic.permissionStatus.GRANTED){
          this.getLocation();
        }
        if(this.diagnostic.permissionStatus.DENIED){
          this.errToast("Please turn on device location to use this apps full features")
        }
      }).catch((error) => {
        this.errToast("Unable to detect user location")
      })
    }
  }

  // call native geolocation plugin to pull coordinates
  getLocation(){
    let options = {enableHighAccuracy: true};
    this.geolocation.getCurrentPosition(options).then((data) => {
      this.mapObject = {
        lat: data.coords.latitude,
        lng: data.coords.longitude,
        zoom: 13,
        visible:true,
        iconUrl: "https://firebasestorage.googleapis.com/v0/b/test1-51a17.appspot.com/o/img%2Fbluedot.png?alt=media&token=9315039e-df6d-4862-9cf1-4087482e4713"
      };
    }).catch((error) => {
      this.errToast("Unable to detect user location")
    });
  }

  errToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }


}
