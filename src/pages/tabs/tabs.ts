import { Component } from '@angular/core';

import { Events }  from 'ionic-angular';

import { AccountPage }    from '../account/account';
import { RecentPage }     from '../recent/recent';
import { FavoritesPage }  from '../favorites/favorites';
import { NearMePage }     from '../nearMe/nearMe';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab2Root = RecentPage;
  tab1Root = NearMePage;
  tab3Root = FavoritesPage;
  tab4Root = AccountPage;

  loggedIn : any = false;

  constructor( public events: Events) {

    events.subscribe('user:loggedIn', (loggedIn, username) => {
      this.showTab(loggedIn);
    });

  };

  showTab(loggedIn){
    this.loggedIn = loggedIn;
  }

}
