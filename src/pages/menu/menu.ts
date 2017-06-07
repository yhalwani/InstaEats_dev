import { Component } from '@angular/core';
import { NavController, NavParams, Events, ModalController, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  menuGroup: Array<{ menuGroupName: string, menu: Array<{name: string, description: string, price: number}>}>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public storage: Storage
  ) {
    this.storage.get('restMenu').then((list) => {
      this.menuGroup = list;
    });
  };

  addMenuGroup(){
    var menuItem = {name : "", description: "", price: 0.00};
    var menuGroupElem = {menuGroupName: "", menu: [menuItem]};
    this.menuGroup.push(menuGroupElem);
  };

  addMenuItem(index){
    var menuItem = {name : "", description: "", price: 0.00};
    this.menuGroup[index].menu.push(menuItem);
  };

  createBundle(){
    let modal = this.modalCtrl.create(ModalContentPage, this.menuGroup);
    modal.present();
  };

};

@Component({
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-title>
        Create Bundle
      </ion-title>
      <ion-buttons start>
        <button ion-button (click)="dismiss()">
          Cancel
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content padding>
    <ion-item>
      <ion-input type="text" placeholder="Bundle Name" [(ngModel)]="bundleName"></ion-input>
    </ion-item>
    <ion-item>
      <ion-input type="text" placeholder="Bundle Description" [(ngModel)]="bundleDescription"></ion-input>
    </ion-item>

    <ion-list *ngFor="let menug of menuGroup; let i = index">
      <ion-list-header>
        <ion-item-divider> {{menug.menuGroupName}} </ion-item-divider>
      </ion-list-header>
      <ion-grid>
        <ion-item-group *ngFor="let menu of menug.menu; let i = index">
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label fixed> {{menu.name}} </ion-label>
                <ion-checkbox (click)="addToBundle(menu)"></ion-checkbox>
              </ion-item>
            </ion-col>
            <ion-col>
              <ion-item>
                <ion-input type="number" disabled="true" placeholder="Discount Percentage" [(ngModel)]="discount"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
        </ion-item-group>
      </ion-grid>
    </ion-list>

    <div text-center>
      <button ion-button large icon-right color="rdaApp" (click)="saveBundle()">
        Save Bundle
        <ion-icon name="pricetags"></ion-icon>
      </button>
    </div>
  </ion-content>
  `
})
export class ModalContentPage {

  menuGroup: Array<{
    menuGroupName:              string,
    menu:          Array<{name: string, description: string, price: number}>
  }>;

  bundle: Array<{
    bundleName:            string,
    bundleDescription:     string,
    bundleElem:        Array<{name: string, description: string, price: number, discount: number}>
  }>;

  bundleName:                   string;
  bundleDescription:            string;
  discount:                     number;

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    public storage: Storage,
    public events: Events
  ) {
    this.menuGroup = this.params.data;
    this.storage.get('bundles').then((list) => {
      this.bundle = list;
    });
  };

  dismiss() {
    this.viewCtrl.dismiss();
  };

  addToBundle(menuItem){
    var bundleItem = {name: menuItem.name, description: menuItem.description, price: menuItem.price, discount: this.discount};

  }

  saveBundle() {
    var bundleGroupElem = {bundleName: this.bundleName, bundleDescription: this.bundleDescription, bundleElem: []};
    this.bundle.push(bundleGroupElem);

    // this.storage.set('bundles', this.bundle);
    this.events.publish('bundle:created', this.bundle);

    this.dismiss();
  };
};
