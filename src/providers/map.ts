import { Injectable } from '@angular/core';
import { Events, LoadingController, ToastController, Platform } from 'ionic-angular';

import { Geolocation }  from '@ionic-native/geolocation';
import { Diagnostic }   from '@ionic-native/diagnostic';
import { Dialogs }      from '@ionic-native/dialogs';

@Injectable()
export class Map {

  defaultLat = 45.216612;
  defaultLng = -82.523330;

  mapObject = {
    // (default)
    lat: this.defaultLat,
    lng: this.defaultLng,
    zoom: 5,
    visible: false,
    iconUrl: ""
  };

  constructor(
    public platform: Platform,
    private geolocation: Geolocation,
    private diagnostic: Diagnostic,
    public toastCtrl: ToastController,
    private dialogs: Dialogs
  ) {

  }

  // checks what platform is being used and then calls respective functions to pull GPS coordinates
  getLocationServices(){
    if(this.platform.is('core')){
      // Set user location using html5 geolocation
      this.getBrowserLocation();
    } else {
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
    return;
  }

  // call native geolocation plugin to pull coordinates (Android & iOS)
  getDeviceLocation(){
    this.geolocation.getCurrentPosition().then((data) => {
      this.mapObject = {
        lat: data.coords.latitude,
        lng: data.coords.longitude,
        zoom: 13,
        visible:true,
        iconUrl: "https://firebasestorage.googleapis.com/v0/b/instaeats-a06a3.appspot.com/o/img%2Fblue_pin.png?alt=media&token=d9166627-d30b-4057-8d05-c84c109c0517"
      };
    }).catch((error) => {
      this.errToast("Unable to detect user location")
    });
  }

  getBrowserLocation(){
    navigator.geolocation.getCurrentPosition((position) => {
        this.mapObject = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          zoom: 13,
          visible: true,
          iconUrl: "https://firebasestorage.googleapis.com/v0/b/instaeats-a06a3.appspot.com/o/img%2Fblue_pin.png?alt=media&token=d9166627-d30b-4057-8d05-c84c109c0517"
        };
      },(error) => {
        if(error.code == error.PERMISSION_DENIED){
          this.errToast("Location Services denied permission")
        }
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
