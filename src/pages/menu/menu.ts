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
        <ion-item-group *ngFor="let menu of menug.menu; let j = index">
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label fixed> {{menu.name}} </ion-label>
                <ion-checkbox (ionChange)="addToBundle(menu, i * menug.menu.length + j, i, j, menug.menu.length, this)"></ion-checkbox>
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
    menuGroupName:         string,
    menu:                  Array<{
      name: string, description: string, price: number
    }>
  }>;

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

  bundleItem: {
    bundleName:            string,
    bundleDescription:     string,
    bundleElem:            Array<{
      menuGroupName:       string,
      menu:                Array<{
        name: string, description: string, price: number, checked: boolean, discount: number
      }>
    }>
  };

  bundleName:                   string;
  bundleDescription:            string;
  discount:                     number;

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    public storage: Storage,
    public events: Events
  ) {

    // Menu is assigned from the input parameter data
    this.menuGroup = this.params.data;

    // Fetch bundles from storage and assign to local variable
    this.storage.get('bundles').then((list) => {
      this.bundles = list;
    });

    //
    this.bundleItem = {
      bundleName:            "",
      bundleDescription:     "",
      bundleElem: []
    };

    // var item = {
    //   name: "",
    //   description: "",
    //   price: 0,
    //   checked: false,
    //   discount: 0
    // };

    for (var i = 0; i < this.menuGroup.length; i++ ){

      var menuItem = {
        menuGroupName:  "",
        menu: []
      }

      menuItem.menuGroupName =  this.menuGroup[i].menuGroupName;
      this.bundleItem.bundleElem.push(menuItem);

      for (var j = 0; j < this.menuGroup[i].menu.length; j++ ){

       var item = {
          name: this.menuGroup[i].menu[j].name,
          description: this.menuGroup[i].menu[j].description,
          price: this.menuGroup[i].menu[j].price,
          checked: false,
          discount: 0
        };

        this.bundleItem.bundleElem[i].menu.push(item);

      };
    };

    console.log(this.bundleItem);

  };

  dismiss() {
    this.viewCtrl.dismiss();
  };

  addToBundle(menuItem, total, group, index, length, checked){
    if (checked == true){
      // console.log(checked.checked + "  " + total + "  " + group + "  " + index + " " + length);
      // var item = {name: menuItem.name, description: menuItem.description, price: menuItem.price, discount: this.discount};
      // this.bundleItem.push(item);
    } else {
      // console.log(checked.checked + "  " + total + "  " + group + "  " + index + " " + length);
      // this.bundleItem.splice(index,1);
    }

  }

  saveBundle() {
    // var bundleGroupElem = {bundleName: this.bundleName, bundleDescription: this.bundleDescription, bundleElem: this.bundleItem};
    this.storage.get('bundles').then((list) => {
      this.bundles = list;
      // this.bundles.push(bundleGroupElem);
      this.storage.set('bundles', this.bundles);
      this.events.publish('bundle:created', this.bundles);
    });

    this.dismiss();
  };
};
