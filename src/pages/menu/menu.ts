import { Component } from '@angular/core';
import { NavController, NavParams, Events, ModalController, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import firebase from 'firebase';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  menuGroup: Array<{
    menuGroupName: string,
    menu: Array<{
      name: string, description: string, price: number
    }>
  }>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public events: Events,
    public storage: Storage
  ) {

      let user = firebase.auth().currentUser;
      let restaurantName = user.displayName

      var menuArr = [];

      firebase.database().ref('/MenuItems/' + user.uid).on("value", (snapshot) => {
        var data = snapshot.val();

        for (var menuG in data){
          var menuGE = {menuGroupName: menuG, menu: []};

          snapshot.child(menuG).forEach((childSnapshot) => {
            var childData = childSnapshot.val();
            var menuI = {name: childData.name, description: childData.description, price: childData.price};
            menuGE.menu.push(menuI);
            return false;
          });
         menuArr.push(menuGE);
        }

        this.storage.set('restMenu', menuArr);
        this.menuGroup = menuArr;

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

  removeGroup(index){
    this.menuGroup.splice(index,1);
  };

  removeItem(menu, item){
    this.menuGroup[menu].menu.splice(item, 1);
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

    <ion-list *ngFor="let menug of bundleMenu; let i = index">
      <ion-list-header>
        <ion-item-divider> {{menug.menuGroupName}} </ion-item-divider>
      </ion-list-header>
      <ion-grid>
        <ion-item-group *ngFor="let menu of menug.menu; let j = index">
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label fixed> {{menu.name}} </ion-label>
                <ion-checkbox [(ngModel)]="bundleMenu[i].menu[j].checked"></ion-checkbox>
              </ion-item>
            </ion-col>
            <ion-col>
              <ion-item>
                <ion-input type="number" disabled=!{{bundleMenu[i].menu[j].checked}} placeholder="Discount Percentage" [(ngModel)]="bundleMenu[i].menu[j].discount"></ion-input>
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

  bundleMenu: Array<{
    menuGroupName:       string,
    menu:                Array<{
      name: string, description: string, price: number, checked: boolean, discount: number
    }>
  }>;

  bundleItem: {
    bundleName:            string,
    bundleDescription:     string,
    live:                  boolean,
    bundleElem:            Array<{
      menuGroupName:       string,
      menu:                Array<{
        name: string, description: string, price: number, checked: boolean, discount: number
      }>
    }>
  };

  bundleName:                   string;
  bundleDescription:            string;

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    public storage: Storage,
    public events: Events
  ) {

    // Menu is assigned from the input parameter data
    this.menuGroup = this.params.data;
    this.bundleMenu = [];

    // Dummy variable to hold bundle
    this.bundleItem = {
      bundleName:            "",
      bundleDescription:     "",
      live:                  false,
      bundleElem: []
    };

    // Loop through menu and init dummy bundle
    for (var i = 0; i < this.menuGroup.length; i++ ){

      var menuItem = {
        menuGroupName:  "",
        menu: []
      }

      menuItem.menuGroupName =  this.menuGroup[i].menuGroupName;
      this.bundleMenu.push(menuItem);

      for (var j = 0; j < this.menuGroup[i].menu.length; j++ ){
        var item = {
          name: this.menuGroup[i].menu[j].name,
          description: this.menuGroup[i].menu[j].description,
          price: this.menuGroup[i].menu[j].price,
          checked: false,
          discount: 0
        };
        this.bundleMenu[i].menu.push(item);
      };

    };

  };

  // Close bundle page
  dismiss() {
    this.viewCtrl.dismiss();
  };

  // Add item to bundle
  addToBundle(group, index){
    this.bundleMenu[group].menu[index].checked = !this.bundleMenu[group].menu[index].checked;
  }

  // Save bundle to storage and push to firebase
  saveBundle() {

    this.bundleItem.bundleName = this.bundleName;
    this.bundleItem.bundleDescription = this.bundleDescription;

    this.bundleMenu.forEach((group, groupIndex) => {
      var groupE = {menuGroupName: group.menuGroupName, menu: []};
      group.menu.forEach((item, itemIndex) =>{
        if(item.checked == true){

          var itemE = {
            name: item.name,
            description: item.description,
            price: item.price,
            checked: item.checked,
            discount: item.discount
          };

          groupE.menu.push(itemE);

        };
      });

      if(groupE.menu.length != 0){
        this.bundleItem.bundleElem.push(groupE);
      };
    });


    this.storage.get('bundles').then((list) => {
      list.push(this.bundleItem);
      this.storage.set('bundles', list);
      this.events.publish('bundle:created', list);
    });

    // reference to firebase database and current user
    var ref = firebase.database().ref("/Bundles");
    var user = firebase.auth().currentUser;

    ref.child(user.uid).update({
      [this.bundleItem.bundleName] : {description : this.bundleItem.bundleDescription, live: this.bundleItem.live, bundle : this.bundleItem.bundleElem }
    });

    this.dismiss();

  };


};
