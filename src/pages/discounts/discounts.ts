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
            var restRef = firebase.database().ref("Restaurant Profiles/");
            var rest = firebase.auth().currentUser;
            var id = rest.uid;
            restRef.child(id).update({
              liveStatus: true
            });
          }
        },
        {
          text: 'Terminate!',
          handler: () => {
            var restRef = firebase.database().ref("Restaurant Profiles/");
            var rest = firebase.auth().currentUser;
            restRef.child(rest.uid).update({
              liveStatus: false
            });
          }
        },
        {
          text: 'Delete',
          handler: () => {
            var name = this.bundles[index].bundleName;
            console.log(name);
            var user = firebase.auth().currentUser;
            var ref = firebase.database().ref("/Bundles/" + user.uid);
            ref.child(name).remove();


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
