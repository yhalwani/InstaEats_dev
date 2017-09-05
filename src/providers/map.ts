import { Injectable } from '@angular/core';

import { Platform } from 'ionic-angular';
import { Events, LoadingController, ToastController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Dialogs }      from '@ionic-native/dialogs';


@Injectable()
export class Map {

  mapObject : {
    lat: number,
    lng: number,
    zoom: number,
    visible: boolean,
    iconUrl: string
  };

  constructor(public platform: Platform, private geolocation: Geolocation, private diagnostic: Diagnostic, public toastCtrl: ToastController, private dialogs: Dialogs) {
    this.mapObject = {
      // (default)
      lat: 45.216612,
      lng: -82.523330,
      zoom: 5,
      visible: false,
      iconUrl: ""
    }
  }

  // checks what platform is being used and then calls respective functions to pull GPS coordinates
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
      // check if device location is turned on then get location
      this.diagnostic.isLocationEnabled().then((isAvailable) => {
        if(isAvailable){
          this.getDeviceLocation();
        } else {
          this.dialogs.confirm("This app requires devices Location Services", "Permission Required", ["Go to Settings", "Cancel"]).then((response) => {
            if(response == 1){
              this.diagnostic.switchToLocationSettings();
            }else{
              // user cancelled prompt
            }
          }).then(() => {
            if(this.diagnostic.permissionStatus.GRANTED){
              this.getDeviceLocation();
            }
            if(this.diagnostic.permissionStatus.DENIED){
            }
          }).catch((error) => {
            // this.errToast("Unable to detect location");
            // this.errToast("error");
          });
        }
      });
    }
  }


  // call native geolocation plugin to pull coordinates (Android & iOS)
  getDeviceLocation(){
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

  // check if device location is switched on (Android & iOS)
  // checkDeviceSettings(){
  //   this.diagnostic.isLocationEnabled().then((isAvailable) => {
  //     if(isAvailable){
  //       this.getDeviceLocation();
  //     } else {
  //       this.dialogs.confirm("This app requires devices Location Services", "Permission Required", ["Go to Settings", "Cancel"]).then((response) => {
  //         if(response == 1){
  //           this.diagnostic.switchToLocationSettings();
  //         }else{
  //           // user cancelled prompt
  //         }
  //       }).then(() => {
  //         if(this.diagnostic.permissionStatus.GRANTED){
  //           this.getDeviceLocation();
  //         }
  //         if(this.diagnostic.permissionStatus.DENIED){
  //         }
  //       }).catch((error) => {
  //         // this.errToast("Unable to detect location");
  //         // this.errToast("error");
  //       });
  //     }
  //   });
  // }

  errToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }


}
