import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, Events, ToastController, LoadingController  } from 'ionic-angular';

import { RestaurantPortalPage } from '../restaurant-portal/restaurant-portal'

@Component({
  selector: 'page-on-board',
  templateUrl: 'on-board.html',
})
export class OnBoardPage {
  @ViewChild(Slides) slides: Slides;
  cuisineTypes: Array<{ type: string, id: string }>;
  menuGroup: Array<{ menuGroupName: string, menu: Array<{name: string, description: string, price: number}>}>;
  username: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events) {
    this.cuisineTypes = [
      {type : "American",     id : "1"},
      {type : "Asian",        id : "2"},
      {type : "Barbecue",     id : "3"},
      {type : "British",      id : "4"},
      {type : "Burgers",      id : "5"},
      {type : "Canadian",     id : "6"},
      {type : "Caribbean",    id : "7"},
      {type : "Chinese",      id : "8"},
      {type : "Comfort Food", id : "9"},
      {type : "Contemporary", id : "10"},
      {type : "Continental",  id : "11"},
      {type : "Creperie",     id : "12"},
      {type : "European",     id : "13"},
      {type : "French",       id : "14"},
      {type : "Gastro",       id : "15"},
      {type : "Global",       id : "16"},
      {type : "Indian",       id : "17"},
      {type : "Italian",      id : "18"},
      {type : "Jamaican",     id : "19"},
      {type : "Japanese",     id : "20"},
      {type : "Latin",        id : "21"},
      {type : "Mediterranean", id : "22"},
      {type : "Mexican",      id : "23"},
      {type : "Pizzeria",     id : "24"},
      {type : "Seafood",      id : "25"},
      {type : "Steakhouse",   id : "26"},
      {type : "Sushi",        id : "27"},
      {type : "Tapas",        id : "28"},
      {type : "Thai",         id : "29"},
      {type : "Bar / Pub",    id : "30"}
    ];
    this.menuGroup = [];
  }

  ionViewDidEnter() {
    this.slides.lockSwipes(true);
  }

  ionSlideDidChange(){
    if (this.slides.getActiveIndex() === 0){
      this.slides.lockSwipes(true);
    }
  }

  loginInfo(){
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipeToNext(true);
  }

  generalInfo(){
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipeToNext(true);
  }

  finish(){
    this.events.publish('restaurant:onboarded', true, this.username);
    this.navCtrl.setRoot(RestaurantPortalPage);
  }

  addMenuGroup(){
    var menuItem = {name : "", description: "", price: 0.00};
    var menuGroupElem = {menuGroupName: "", menu: [menuItem]};
    this.menuGroup.push(menuGroupElem);
  }

  addMenuItem(index){
    var menuItem = {name : "", description: "", price: 0.00};
    this.menuGroup[index].menu.push(menuItem);
  }


}
