import { Component } from '@angular/core';
import { NavController, NavParams, Events, ActionSheetController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import firebase from 'firebase';

@Component({
  selector: 'page-discounts',
  templateUrl: 'discounts.html',
})
export class DiscountsPage {

  bundles: Array<{
    bundleName:            string,
    bundleDescription:     string,
    live:                  boolean,
    countDown:             {intvarlID: any; hours: any, minutes: any, seconds: any},
    bundleElem:            Array<{
      menuGroupName:       string,
      menu:                Array<{
        name: string, description: string, price: number, checked: boolean, discount: number
      }>
    }>
  }>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public storage: Storage,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController
  ) {

    var bundlesArr = [];
    var restaurantId = firebase.auth().currentUser.uid;
    var bundleNode = firebase.database().ref("/Bundles/" + restaurantId);

    // Entering the restaurants bundles node in fb
    bundleNode.once('value', (snapshot) => {

      // For each bundle the rest has loop
      snapshot.forEach( (childSnapshot) => {

        // Tmp dummy bundle
        var bundle = {
          bundleName: childSnapshot.key,
          bundleDescription:"",
          live: false,
          countDown: {intvarlID: 0, hours: 0, minutes: 0, seconds: 0},
          bundleElem: []
        }

        // For each node in bundle (bunlde, description, or live) loop
        childSnapshot.forEach((childSnapshot) => {

          if (childSnapshot.key == "description"){
            bundle.bundleDescription = childSnapshot.val();
          } else if (childSnapshot.key == "live") {
            bundle.live = childSnapshot.val();
          } else {

            childSnapshot.forEach((childSnapshot) => {

              var bundleE = {menuGroupName:"", menu: []};
              childSnapshot.forEach((childSnapshot) => {
                if(childSnapshot.key == "menuGroupName"){
                  bundleE.menuGroupName = childSnapshot.val();
                } else {
                  childSnapshot.forEach((childSnapshot) => {
                    var tmp = childSnapshot.val();
                    var menu = {
                      name:         tmp.name,
                      description:  tmp.description,
                      price:        tmp.price,
                      checked:      tmp.checked,
                      discount:     tmp.discount
                    };
                    bundleE.menu.push(menu);
                    return false;
                  })
                };
                return false;
              });
              bundle.bundleElem.push(bundleE);
              return false;
            });
          };
          return false;
        });
        bundlesArr.push(bundle);
        return false;
      });
      this.bundles = bundlesArr;
    });

    this.events.subscribe('bundle:created', (bundle) => {
      this.bundles = bundle;
    });

  };


  presentActionSheet(index) {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.bundles[index].bundleName,
      buttons: [
        {
          text: 'Go Live!',
          handler: () => {
            this.getTime(index);
          }
        },
        {
          text: 'Terminate!',
          handler: () => {
            var restRef = firebase.database().ref("Bundles/");
            var rest = firebase.auth().currentUser;
            restRef.child(rest.uid).child(this.bundles[index].bundleName).update({
              live: false,
              startedAt: null
            });
            this.bundles[index].live = !this.bundles[index].live;
            this.stopTime(this.bundles[index]);
          }
        },
        {
          text: 'Delete',
          handler: () => {
            var name = this.bundles[index].bundleName;

            // delete the bundle from firebase database
            var user = firebase.auth().currentUser;
            var ref = firebase.database().ref("/Bundles/" + user.uid);
            ref.child(name).remove();

            // delete from local as well
            this.bundles.splice(index,1);
            this.storage.get('bundles').then((list) => {
              console.log(list);
              // list.splice(index,1);
              // this.storage.set('bundles', list);
            });
          }
        }
      ]
    });

    actionSheet.present();
  };

  getTime(index){
    let alert = this.alertCtrl.create({
      title: 'Input discount duration',
      inputs: [
        {
          name: 'Hours',
          placeholder: 'Hours',
          type: 'number'
        },
        {
          name: 'Minutes',
          placeholder: 'Minutes',
          type: 'number'
        },
        {
          name: 'Seconds',
          placeholder: 'Seconds',
          type: 'number'
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
          text: 'Set Time',
          handler: data => {
            var timeLimit = (data.Hours * 1000 * 60 * 60) + (data.Minutes * 1000 * 60 ) + (data.Seconds * 1000);
            var now = new Date().getTime();

            var restRef = firebase.database().ref("Bundles/");
            var rest = firebase.auth().currentUser;
            restRef.child(rest.uid).child(this.bundles[index].bundleName).update({
              live: true,
              startedAt: now
            });

            this.bundles[index].live = !this.bundles[index].live;
            this.setTime(now, timeLimit, this.bundles[index]);
            return;
          }
        }
      ]
    });
    alert.present();
  }

  setTime(now, timeLimit, bundle){
    bundle.countDown.intvarlID = setInterval(() => {
      var diff = new Date().getTime() - now ;
      bundle.countDown.hours = Math.floor((timeLimit - diff) / (1000 * 60 * 60));
      bundle.countDown.minutes =  Math.floor(((timeLimit - diff) % (1000 * 60 * 60)) / (1000 * 60));
      bundle.countDown.seconds = Math.floor(((timeLimit - diff) % (1000 * 60)) / 1000)
    }, 1000);
  };

  stopTime(bundle){
    clearInterval(bundle.countDown.intvarlID);
    bundle.countDown.hours = 0;
    bundle.countDown.minutes = 0;
    bundle.countDown.seconds = 0;
  };

}
