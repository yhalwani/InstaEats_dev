import { Component } from '@angular/core';

import { RecentPage } from '../recent/recent';
import { FavoritesPage } from '../favorites/favorites';
import { NearMePage } from '../nearMe/nearMe';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab2Root = RecentPage;
  tab1Root = NearMePage;
  tab3Root = FavoritesPage;

  constructor() {

  }
}
