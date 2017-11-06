import { Injectable }                 from '@angular/core';
import { ViewController, Events }      from 'ionic-angular';
import { Dialogs }                    from '@ionic-native/dialogs';
import { RestaurantPage } from '../pages/restaurant-page/restaurant-page';

import firebase from 'firebase';

declare var FCMPlugin;

@Injectable()
export class FcmNotifications {

  token: any;

  constructor(
    public events: Events,
    private dialogs: Dialogs,
  ) {

      this.token = "";

      // events.subscribe('user:loggedOut', (loggedOut) =>{
      //   this.fcmLoggout();
      // });

  };

  init(){
    if(typeof(FCMPlugin) !== "undefined"){
      FCMPlugin.getToken(function(t){

      }, function(e){
        alert(e);
      });

      FCMPlugin.onNotification((data) => {

        // in background
        if(data.wasTapped){
          alert(data.body);
        } else {
          // in foreground
          this.dialogs.confirm(data.body, data.title, ["Dismiss"]).then((response) => {
            // if(response == 1){
            //
            //   let restRef = firebase.database().ref("Restaurant Profiles/");
            //   restRef.orderByChild("restaurantName").equalTo(data.name).once("value", function(snapshot) {
            //     var data = snapshot.val();
            //     this.viewCtrl.push(RestaurantPage, data);
            //   });
            //
            // }else{
            //
            // };
          });

        }
      }, (msg) => {
        // this.dialogs.alert(err);
      }, (err) => {
        // this.dialogs.alert(err);
      });
    };
  };

  fcmLoggout(){

  };

  getToken(){
    FCMPlugin.getToken((t) => {
      this.token = t;
    });
  };

  fcmSubscribe(rest){
    FCMPlugin.subscribeToTopic(rest);
  };

  fcmUnsubscribe(rest){
    FCMPlugin.unsubscribeFromTopic(rest);
  };

}
