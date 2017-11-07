import { Injectable } from '@angular/core';
import { AlertController, Events } from 'ionic-angular';

import firebase from 'firebase';

@Injectable()
export class User {

  user : {
    email: string,
    username: any,
    loggedIn: boolean,
    fcmToken: any
  };

  constructor(private alertCtrl: AlertController, public events: Events) {
    this.user = {email: "", username: "", loggedIn: false, fcmToken: ""};
  }

  // change user password
  changePassword(newPassword){
    let thisalert = this.alertCtrl.create({
      title: 'Update Password',
      inputs: [
        {
          name: 'Current_Password',
          placeholder: 'Current Password',
          type: 'password'
        },
        {
          name: 'New_Password',
          placeholder: 'New Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {

          }
        },
        {
          text: 'Update',
          handler: data => {
            var user = firebase.auth().currentUser;
            var credential = firebase.auth.EmailAuthProvider.credential(
              user.email,
              data.Current_Password
            )
            user.reauthenticateWithCredential(credential).then(() => {
              user.updatePassword(data.New_Password).then(() => {
                // update successful
                alert("Password successfully updated")
              }).catch((error) => {
                // error
                alert("Unable to update password " + error);
              })
            }).catch((error) => {
              alert(error);
            })
          }
        }
      ]
    });
    thisalert.present();
  }

  // delete user account from firebase
  deleteAccount(){
    // var user = firebase.auth().currentUser;
    let thisalert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'Are you sure you want to delete this account? All your data will be lost',
      inputs: [
        {
          name: 'Password',
          placeholder: 'Password',
          type: 'password'
        }
      ],
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
          handler: data => {
            var user = firebase.auth().currentUser;
            var credential = firebase.auth.EmailAuthProvider.credential(
              user.email,
              data.Password
            )
            user.reauthenticateWithCredential(credential).then(() => {
              user.delete().then(() => {
                alert("User deleted")
                this.events.publish('user:loggedOut');
              }).catch((error) => {
                alert(error);
              })
            }).catch((error) => {
              alert(error);
            })

          }
        }
      ]
    });
    thisalert.present()
  }

  // update bundle if timer goes to zero
  updateBundleStatus(){
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
