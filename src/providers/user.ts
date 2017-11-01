import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class User {

  user : {
    email: string,
    username: any,
    loggedIn: boolean,
    fcmToken: any
  };

  constructor(private alertCtrl: AlertController) {
    this.user = {email: "", username: "", loggedIn: false, fcmToken: ""};
  }

  // change user password
  changePassword(newPassword){
    var user = firebase.auth().currentUser;
    user.updatePassword(newPassword).then(() => {
      // update successful
      alert("Password successfully updated")
    }).catch((error) => {
      // error
      alert("Unable to update password " + error);
    })
  }

  // delete user account from firebase
  deleteAccount(){
    var user = firebase.auth().currentUser;
    let alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'Are you sure you want to delete this account?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            user.delete().then(() => {
              console.log("User deleted")
            }).catch((error) => {
              console.log(error);
            })
          }
        }
      ]
    });
    alert.present()
  }

  // update bundle if timer goes to zero
  updataBundleStatus(){
    let bundleNode = firebase.database().ref("/Bundles/");
    bundleNode.on('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        childSnapshot.forEach((coupons) => {
          let data = coupons.val();
          if(data.live = true){
            let timeStarted = data.timeStarted;
            var nowCheck = new Date().getTime() - timeStarted;
            if ( nowCheck > data.duration ) {
              coupons.ref.update({
                duration: null,
                live: false,
                timeStarted: null
              })
              return false
            }
          }
          return false;
        })
        return false;
      })

    })
  }


}
