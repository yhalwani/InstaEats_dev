import { Component } from '@angular/core';
import { Platform, NavController, NavParams, Events, ActionSheetController, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { StripePage } from '../stripe/stripe';


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
    duration:              number,
    timeStarted:           number,
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

    // let loader = this.loadingCtrl.create({
    //   content: "Fetching bundles...",
    //   duration: 1000
    // });
    // loader.present();

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
            duration:         bundle.duration,
            timeStarted:      bundle.timeStarted,
            ongoing:          bundle.ongoing,
            live:             bundle.live,
            countDown:        {intvarlID: "", hours: "", minutes: "", seconds: ""},
            bundleElem:       bundle.bundleElem
          };

          this.bundles[bundleIndex] = bundleTmp;

        });

        this.events.subscribe('bundle:created', (bundle) => {
          this.bundles = bundle;
        });

        this.bundles.forEach((bundle) => {
          if(!bundle.ongoing){
            bundle.countDown.intvarlID = setInterval(() => {
              var diff = new Date().getTime() - bundle.timeStarted;
              bundle.countDown.hours   =  Math.floor( (bundle.duration - diff) / (1000 * 60 * 60)) + ":";
              bundle.countDown.minutes =  Math.floor(((bundle.duration - diff) % (1000 * 60 * 60)) / (1000 * 60)) + ":";
              bundle.countDown.seconds =  Math.floor(((bundle.duration - diff) % (1000 * 60)) / 1000)
            }, 1000);
          }
        })
      } else {

      }
    });

  }

  ngOnInit(){
    let user = firebase.auth().currentUser;

    firebase.database().ref('Restaurant Profiles/' + user.uid).child('stripe').once('value', (snapshot) => {
      let data = snapshot.val().plan;

      if(data === "InstaEats_basicP" || data === "none"){
        document.getElementById('nocoupons').style.display = "block";
        document.getElementById('showBundles').style.display = "none";
      } else {
        document.getElementById('nocoupons').style.display = "none";
        document.getElementById('showBundles').style.display = "block";
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
    var restRef = firebase.database().ref("Bundles/");
    var rest = firebase.auth().currentUser;

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

            if(data.Other){
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
    if(timeLimit){
      bundle.countDown.intvarlID = setInterval(() => {
        var diff = new Date().getTime() - now;
        bundle.countDown.hours   =  Math.floor( (timeLimit - diff) / (1000 * 60 * 60)) + ":";
        bundle.countDown.minutes =  Math.floor(((timeLimit - diff) % (1000 * 60 * 60)) / (1000 * 60)) + ":";
        bundle.countDown.seconds =  Math.floor(((timeLimit - diff) % (1000 * 60)) / 1000)
      }, 1000);
    } else {
      bundle.countDown.hours = null;
      bundle.countDown.minutes = null;
      bundle.countDown.seconds = null;
    }

  };

  stopTime(bundle){
    clearInterval(bundle.countDown.intvarlID);
    bundle.countDown.hours = 0;
    bundle.countDown.minutes = 0;
    bundle.countDown.seconds = 0;
  };


  getPaymentMethod(){
    this.navCtrl.push(StripePage);
  }


}
