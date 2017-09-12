import { Injectable }   from '@angular/core';
import { Events }       from 'ionic-angular';
import { FCM }          from '@ionic-native/fcm';


@Injectable()
export class FcmNotifications {

  token: any;

  constructor(public events: Events, public fcm:FCM) {
      this.token = "";

      events.subscribe('user:loggedOut', (loggedOut) =>{
        this.fcmLoggout();
      });

  };


  fcmInit(){
    this.fcm.getToken()
      .then(token => {
        this.token = token;
      });

    this.fcm.onNotification()
      .subscribe(data => {
        if(data.wasTapped){
          console.log("Recieved in background");
        } else {
          console.log("Recieved in foreground");
        }
      });
  };

  fcmLoggout(){
    this.token = "";

    this.fcm.onNotification()
      .subscribe(data => {

      });

  };

  fcmGetToken(){
    this.fcm.getToken()
      .then(token => {
        this.token = token;
      });
  };

  fcmSubscribe(rest){
    this.fcm.subscribeToTopic(rest);
  };

  fcmUnsubscribe(rest){
    this.fcm.unsubscribeFromTopic(rest);
  };

}
