import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
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
    public storage: Storage
  ) {

    this.storage.get('bundles').then((list) => {
      this.bundles = list;
    })

    this.events.subscribe('bundle:created', (bundle) => {
      console.log("Bundle created");
      this.bundles = bundle;
      console.log(this.bundles);
    });

  }

  ionViewDidLoad() {
    console.log(this.bundles);
  }

}
