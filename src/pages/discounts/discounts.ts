import { Component } from '@angular/core';
import { NavController, NavParams, Events, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-discounts',
  templateUrl: 'discounts.html',
})
export class DiscountsPage {

  bundles: Array<{
    bundleName:            string,
    bundleDescription:     string,
    bundleElem:        Array<{name: string, description: string, price: number, discount: number}>
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
            console.log('Fuck it! Well do it live!');
          }
        },
        {
          text: 'Terminate!',
          handler: () => {
            console.log('Astalavista!');
          }
        },
        {
          text: 'Delete',
          handler: () => {
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
