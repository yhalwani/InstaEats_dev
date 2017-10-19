import { Component } from '@angular/core';
import { Platform, NavController, NavParams, Events, ActionSheetController, LoadingController, AlertController } from 'ionic-angular';
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
    total:                 number,
    totalDiscount:         number,
    totalPercent:          number,
    countDown:             {intvarlID: any, hours: any, minutes: any, seconds: any},
    ongoing:               string,
    bundleElem:            Array<{
      menuGroupName:       string,
      menu:                Array<{
        name: string, description: string, price: number, checked: boolean, discount: number, percent: number
      }>
    }>
  }>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public storage: Storage,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public platform: Platform,
    public loadingCtrl: LoadingController
  ) {

    let loader = this.loadingCtrl.create({
      content: "Fetching bundles...",
      duration: 2000
    });
        loader.present();

    var bundlesArr = [];
    var restaurantId = firebase.auth().currentUser.uid;
    var bundleNode = firebase.database().ref("/Bundles/" + restaurantId);

    // Entering the restaurants bundles node in fb
    bundleNode.once('value', (snapshot) => {
      if(snapshot.val() != null){

      // For each bundle the rest has loop
      snapshot.forEach((childSnapshot) => {

        bundlesArr.push(childSnapshot.val());
        this.bundles = bundlesArr;
        return false;

      });

      this.bundles.forEach((bundle, bundleIndex) => {
            var bundleTmp = {
              bundleName:       bundle.bundleName,
              bundleDescription:bundle.bundleDescription,
              total:            bundle.total,
              totalDiscount:    bundle.totalDiscount,
              totalPercent:     bundle.totalPercent,
              ongoing:          bundle.ongoing,
              live:             bundle.live,
              countDown:        {intvarlID: 0, hours: 0, minutes: 0, seconds: 0},
              bundleElem:       bundle.bundleElem
            };

            this.bundles[bundleIndex] = bundleTmp;

      });

    this.events.subscribe('bundle:created', (bundle) => {
      this.bundles = bundle;
    });
    }
  });

}

  presentActionSheet(index) {

    var rest = firebase.auth().currentUser;
    var restRef = firebase.database().ref("/Bundles/" + rest.uid)

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
            restRef.child(this.bundles[index].bundleName).update({
              live: false,
              timeStarted: null,
              duration: null,
              ongoing: null
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
            restRef.child(name).remove();

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

  ionViewLoaded(){

    var restRef = firebase.database().ref("Bundles/");
    var rest = firebase.auth().currentUser;
    var headertag;

    restRef.child(rest.uid).once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        let data = childSnapshot.val();
        headertag = data.ongoing;
        console.log(headertag)
        document.getElementById("headertag").innerHTML = headertag;
        return false
      })

    })
  }

  getTime(index){
    var restRef = firebase.database().ref("Bundles/");
    var rest = firebase.auth().currentUser;
    // var headertag;
    //
    // restRef.child(rest.uid).once('value', (snapshot) => {
    //   let data = snapshot.val();
    //   headertag = data.ongoing;
    // })
    //
    // document.getElementById("headertag").innerHTML = headertag;


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
        },
        {
          name: 'Other',
          placeholder: 'Ongoing, Valid until, etc.',
          type: 'string'
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

            if(data.Hours <= 0 && data.Minutes <= 0 && data.Seconds <= 0){
              restRef.child(rest.uid).child(this.bundles[index].bundleName).update({
                live: true,
                ["ongoing"]: data.Other
              });

            } else {

              var timeLimit = (data.Hours * 1000 * 60 * 60) + (data.Minutes * 1000 * 60 ) + (data.Seconds * 1000);
              var now = new Date().getTime();

              restRef.child(rest.uid).child(this.bundles[index].bundleName).update({
                live: true,
                timeStarted: now,
                duration: timeLimit
              });
              document.getElementById("headertag").innerHTML = data.Ongoing;
          }

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
      var diff = new Date().getTime() - now;
      bundle.countDown.hours   =  Math.floor( (timeLimit - diff) / (1000 * 60 * 60));
      bundle.countDown.minutes =  Math.floor(((timeLimit - diff) % (1000 * 60 * 60)) / (1000 * 60));
      bundle.countDown.seconds =  Math.floor(((timeLimit - diff) % (1000 * 60)) / 1000)
    }, 1000);
  };

  stopTime(bundle){
    clearInterval(bundle.countDown.intvarlID);
    bundle.countDown.hours = 0;
    bundle.countDown.minutes = 0;
    bundle.countDown.seconds = 0;
  };


}
