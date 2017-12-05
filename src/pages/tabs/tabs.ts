import { Component } from '@angular/core';

import { Events, NavController }  from 'ionic-angular';

import { AccountPage }    from '../account/account';
import { RecentPage }     from '../recent/recent';
import { FavoritesPage }  from '../favorites/favorites';
import { NearMePage }     from '../nearMe/nearMe';

import { User }           from '../../providers/user';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tabs: Array<{
    component: any,
    title: string,
    icon: string
  }>;

  loggedIn: any = false;

  constructor(public events: Events, public navCtrl: NavController, public userService: User) {

    events.subscribe('user:loggedOut', (loggedIn) => {
      this.rmAccount();
    });

    this.tabs = [
      {component: RecentPage, title: "Recent", icon: "clock"},
      {component: NearMePage, title: "Near Me", icon: "pin"},
      {component: FavoritesPage, title: "Favorites", icon: "heart"}
    ];

    // this.loggedIn = userService.user.loggedIn;
    //
    // if (this.loggedIn == true) {
    //   this.tabs = [
    //     {component: RecentPage, title: "Recent", icon: "clock"},
    //     {component: NearMePage, title: "Near Me", icon: "pin"},
    //     {component: FavoritesPage, title: "Favorites", icon: "heart"},
    //     {component: AccountPage, title: "Account", icon: "person"}
    //   ];
    // } else {
    //   this.tabs = [
    //     {component: RecentPage, title: "Recent", icon: "clock"},
    //     {component: NearMePage, title: "Near Me", icon: "pin"},
    //     {component: FavoritesPage, title: "Favorites", icon: "heart"}
    //   ];
    //
    // };

  };


  rmAccount(){
    this.tabs.splice(3,1);
  };


};
