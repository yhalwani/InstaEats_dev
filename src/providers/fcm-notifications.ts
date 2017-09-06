import { Injectable }       from '@angular/core';
import { Events }  from 'ionic-angular';

declare var FCMPlugin;

@Injectable()
export class FcmNotifications {

  token: any;

  constructor(public events: Events) {
      this.token = "";

      events.subscribe('user:loggedOut', (loggedOut) =>{
        this.fcmLoggout();
      });

  }

  fcmInit(){
    if(typeof(FCMPlugin) !== "undefined"){
      FCMPlugin.getToken( (t) => {
        this.token = t;
      }, function(e){
        alert("Error: " + e);
      });

      FCMPlugin.onNotification(function(d){
        if(d.wasTapped){
          alert("D was tapped " + JSON.stringify(d));

        } else {
          alert("D was not tapped " + JSON.stringify(d) + d.Key);
        }
      }, function(msg){
          alert("Msg: " + msg)
      }, function(err){
        alert("Error: " + err);
      });
    } else alert("Notifications disabled, only provided in Android/iOS environment");
  };

  fcmLoggout(){
    if(typeof(FCMPlugin) !== "undefined"){
      this.token = "";

      FCMPlugin.onNotification(function(d){

      }, function(msg){

      }, function(err){

      });
    };
  };

  fcmGetToken(){
    FCMPlugin.getToken((t)=>{
      this.token = t;
    }, (err)=>{
      alert("Error: " + err);
    });
  };

}
