import { Injectable }                 from '@angular/core';
import { NavController, Events }      from 'ionic-angular';
import { Dialogs }                    from '@ionic-native/dialogs';
import { RestaurantPage } from '../pages/restaurant-page/restaurant-page';

import firebase from 'firebase';

declare var FCMPlugin;

@Injectable()
export class FcmNotifications {

  token: any;

  constructor(
    public events: Events,
    private dialogs: Dialogs
  ) {
      this.token = "";

      events.subscribe('user:loggedOut', (loggedOut) =>{
        this.fcmLoggout();
      });

  };

  init(){
    if(typeof(FCMPlugin) !== "undefined"){
      FCMPlugin.getToken(function(t){

      }, function(e){
        alert(e);
      });

      FCMPlugin.onNotification((data) => {
        if(data.wasTapped){
          alert(data.body);
        } else {
          this.dialogs.confirm(data.body, data.title, ["Go to Restaurant", "Cancel"]).then((response) => {
            if(response == 1){

              let restRef = firebase.database().ref("Restaurant Profiles/");
              var rest = restRef.orderByChild("restaurantName").startAt(data.name);
              rest.once("value", function(snapshot) {
                var data = snapshot.val();
                this.navCtrl.push(RestaurantPage, data);
              });

            }else{

            };
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
