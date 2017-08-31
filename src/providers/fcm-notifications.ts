import { Injectable }       from '@angular/core';
import { AlertController }  from 'ionic-angular';

declare var FCMPlugin;

@Injectable()
export class FcmNotifications {

  token: any;

  constructor(public alertCtrl: AlertController) {
      alert("FCM Token cnstr");
      this.token = "";
  }

  fcmInit(){
    if(typeof(FCMPlugin) !== "undefined"){
      alert("FCMPlugin defined");
      FCMPlugin.getToken( (t) => {
        alert(this.token);
      }, function(e){
        alert("Uh-Oh no token!");
      });

      FCMPlugin.onNotification(function(d){
        if(d.wasTapped){
          alert(JSON.stringify(d));
        } else {
          alert(JSON.stringify(d));
        }
      }, function(msg){
        // No problemo, registered callback
        alert(msg);
      }, function(err){
        alert(err);
      });
    } else alert("Notifications disabled, only provided in Android/iOS environment");
  };

  fcmGetToken(){
    FCMPlugin.getToken((t)=>{
      this.token = t;
    }, (err)=>{
      alert(err);
    });
  };

  showAlert(label, msg){
    let alert = this.alertCtrl.create({
      title: label,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  };

}
