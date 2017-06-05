import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
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
  }

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
          <span ion-text color="rdaApp" showWhen="ios">Cancel</span>
          <ion-icon name="md-close" showWhen="android, windows"></ion-icon>
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content padding>
    <ion-list *ngFor="let menug of menuGroup; let i = index">
      <ion-list-header>
        <ion-label>Group name</ion-label>
        <ion-input type="text" value="{{menug.menuGroupName}}" [(ngModel)]="menug.menuGroupName"></ion-input>
      </ion-list-header>
      <ion-item-group *ngFor="let menu of menug.menu; let i = index">
        <ion-item>
          <ion-label> menu.name </ion-label>
          <ion-checkbox></ion-checkbox>
        </ion-item>
      </ion-item-group>
    </ion-list>
  </ion-content>  
  `
})
export class ModalContentPage {

  menuGroup: Array<{ menuGroupName: string, menu: Array<{name: string, description: string, price: number}>}>;

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    this.menuGroup = this.params.data;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
