import { Component } from '@angular/core';
import { NavController, NavParams, Events, ActionSheetController } from 'ionic-angular';
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
    public actionSheetCtrl: ActionSheetController
  ) {

    this.storage.get('bundles').then((list) => {
      this.bundles = list;
    })

    this.events.subscribe('bundle:created', (bundle) => {
      this.bundles = bundle;
    });

  }


  presentActionSheet(index) {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.bundles[index].bundleName,
      buttons: [
        {
          text: 'Go Live!',
          handler: () => {
            var restRef = firebase.database().ref("Bundles/");
            var rest = firebase.auth().currentUser;
            restRef.child(rest.uid).child(this.bundles[index].bundleName).update({
              live: true
            });
          }
        },
        {
          text: 'Terminate!',
          handler: () => {
            var restRef = firebase.database().ref("Bundles/");
            var rest = firebase.auth().currentUser;
            restRef.child(rest.uid).child(this.bundles[index].bundleName).update({
              live: false
            });
          }
        },
        {
          text: 'Delete',
          handler: () => {

            var rest = firebase.auth().currentUser;
            var restRef = firebase.database().ref("/Bundles/" + rest.uid);
            restRef.child(this.bundles[index].bundleName).remove();

            this.bundles.splice(index,1);
            this.storage.get('bundles').then((list) => {
              list.splice(index,1);
              this.storage.set('bundles', list);
            });

          }
        }
      ]
    });

    actionSheet.present();
  }

}
