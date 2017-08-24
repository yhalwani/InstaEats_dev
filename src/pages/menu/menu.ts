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
      var menuArr = [];

      firebase.database().ref('/MenuItems/' + user.uid).once("value", (snapshot) => {
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

  // Push menu to firebase
  updateMenu(){
    let uid = firebase.auth().currentUser.uid;
    let menuNode = firebase.database().ref("MenuItems");
    let length = this.menuGroup.length;

    let childNode = menuNode.child(uid);
    for (var i = 0; i < length; i++) {
      childNode.update({
        [this.menuGroup[i].menuGroupName]: this.menuGroup[i].menu
      });
    }
  }

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

    <br>

    <ion-grid>
      <ion-row>
        <ion-col col-2>
          Check to add to discount
        </ion-col>
        <ion-col col-4>
          Item Name
        </ion-col>
        <ion-col col-2>
          Price
        </ion-col>
        <ion-col col-2>
          Discounted Price
        </ion-col>
        <ion-col col-2>
          Discount Percentage
        </ion-col>
      </ion-row>
    </ion-grid>

    <br>

    <ion-list *ngFor="let menug of bundleMenu; let i = index">
      <ion-list-header>
        <ion-item-divider> {{menug.menuGroupName}} </ion-item-divider>
      </ion-list-header>
      <ion-grid>
        <ion-item-group *ngFor="let menu of menug.menu; let j = index">
          <ion-row>
            <ion-col col-2>
              <ion-item>
                <!-- <ion-label> {{menu.name}} </ion-label> -->
                <ion-checkbox [(ngModel)]="bundleMenu[i].menu[j].checked" (click)='sumTotal()'></ion-checkbox>
              </ion-item>
            </ion-col>
            <ion-col col-4>
              <ion-item>
                {{menu.name}}
              </ion-item>
            </ion-col>
            <ion-col col-2>
              <ion-item>
                 $ {{menu.price}}
              </ion-item>
            </ion-col>
            <ion-col col-2>
              <ion-item>
                <ion-input type="number" [disabled]=!bundleMenu[i].menu[j].checked [(ngModel)]="bundleMenu[i].menu[j].discount" (change)='sumTotalPrice(i,j)'></ion-input>
              </ion-item>
            </ion-col>
            <ion-col col-2>
              <ion-item>
                <ion-input type="number" [disabled]=!bundleMenu[i].menu[j].checked [(ngModel)]="bundleMenu[i].menu[j].percent" (change)='sumTotalPercent(i,j)'></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
        </ion-item-group>
      </ion-grid>
    </ion-list>

    <br>

    <ion-grid>
      <ion-row>
        <ion-col col-6>

        </ion-col>
        <ion-col col-2>
          Total Price
        </ion-col>
        <ion-col col-2>
          Total Discounted Price
        </ion-col>
        <ion-col col-2>
          Total Discount Percentage
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-6>

        </ion-col>
        <ion-col col-2>
          {{totalPrice}}
        </ion-col>
        <ion-col col-2>
          $ {{totalDiscountPrice}}
        </ion-col>
        <ion-col col-2>
          % {{totalDiscountPercent}}
        </ion-col>
      </ion-row>
    </ion-grid>

    <br>

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
      name: string, description: string, price: number, checked: boolean, discount: number, percent: number
    }>
  }>;

  bundleItem: {
    bundleName:            string,
    bundleDescription:     string,
    live:                  boolean,
    total:                 number,
    totalDiscount:         number,
    totalPercent:          number,
    bundleElem:            Array<{
      menuGroupName:       string,
      menu:                Array<{
        name: string, description: string, price: number, checked: boolean, discount: number, percent: number
      }>
    }>
  };

  bundleName:                   string;
  bundleDescription:            string;

  totalDiscountPrice:           number;
  totalDiscountPercent:         number;
  totalPrice:                   number;

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    public storage: Storage,
    public events: Events
  ) {

    this.totalDiscountPrice    = 0;
    this.totalDiscountPercent  = 0;
    this.totalPrice            = 0;

    // Menu is assigned from the input parameter data
    this.menuGroup = this.params.data;
    this.bundleMenu = [];

    // Dummy variable to hold bundle
    this.bundleItem = {
      bundleName:            "",
      bundleDescription:     "",
      live:                  false,
      total:                 0,
      totalDiscount:         0,
      totalPercent:          0,
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
          discount: 0,
          percent: 0
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
  };

  sumTotal(){
    var sum = 0;
    this.bundleMenu.forEach((group, groupIndex) => {
      group.menu.forEach((item, itemIndex) => {
        if(item.checked == true){
          sum += Number(item.price);
        } else {
          item.discount = 0;
          item.percent = 0;
        };
      });
    });
    this.totalPrice = sum;
    this.sumTotals();
  }

  sumTotalPrice(i,j){
    this.bundleMenu[i].menu[j].percent = Math.floor(100 - ((this.bundleMenu[i].menu[j].discount / this.bundleMenu[i].menu[j].price) * 100));
    this.sumTotals()
  }

  sumTotalPercent(i,j){
    this.bundleMenu[i].menu[j].discount = this.bundleMenu[i].menu[j].price * ((100 - this.bundleMenu[i].menu[j].percent) / 100)
    this.sumTotals();
  }

  sumTotals(){
    var sumDiscount = 0;
    this.bundleMenu.forEach((group, groupIndex) => {
      group.menu.forEach((item, itemIndex) => {
        if(item.checked == true){
          sumDiscount += Number(item.discount);
        };
      });
    });
    this.totalDiscountPrice = sumDiscount;
    var percent = Math.floor(100 - (100 * this.totalDiscountPrice / this.totalPrice));
    this.totalDiscountPercent = ( percent > 0) ? percent : 0;
  }

  // Save bundle to storage and push to firebase
  saveBundle() {

    this.bundleItem.bundleName = this.bundleName;
    this.bundleItem.bundleDescription = this.bundleDescription;

    this.bundleItem.total = this.totalPrice;
    this.bundleItem.totalDiscount = this.totalDiscountPrice;
    this.bundleItem.totalPercent = this.totalDiscountPercent;

    this.bundleMenu.forEach((group, groupIndex) => {
      var groupE = {menuGroupName: group.menuGroupName, menu: []};
      group.menu.forEach((item, itemIndex) =>{
        if(item.checked == true){

          var itemE = {
            name: item.name,
            description: item.description,
            price: item.price,
            checked: item.checked,
            discount: item.discount,
            percent: item.percent
          };

          groupE.menu.push(itemE);

        };
      });

      if(groupE.menu.length != 0){
        this.bundleItem.bundleElem.push(groupE);
      };
    });


    // this.storage.get('bundles').then((list) => {
    //   list.push(this.bundleItem);
    //   this.storage.set('bundles', list);
    //   this.events.publish('bundle:created', list);
    // });

    // reference to firebase database and current user
    var ref = firebase.database().ref("/Bundles");
    var user = firebase.auth().currentUser;

    ref.child(user.uid).update({
      [this.bundleItem.bundleName] : {
        bundleName: this.bundleItem.bundleName,
        bundleDescription : this.bundleItem.bundleDescription,
        live: this.bundleItem.live,
        total: this.bundleItem.total,
        totalDiscount: this.bundleItem.totalDiscount,
        totalPercent: this.bundleItem.totalPercent,
        bundleElem : this.bundleItem.bundleElem
      }
    });

    this.dismiss();

  };


};
