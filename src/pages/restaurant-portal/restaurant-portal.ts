import { Component } from '@angular/core';

import { InfoPage } from '../info/info';
import { MenuPage } from '../menu/menu';
import { DiscountsPage } from '../discounts/discounts';

@Component({
  templateUrl: 'restaurant-portal.html'
})
export class RestaurantPortalPage {

  tab1Root = InfoPage;
  tab2Root = MenuPage;
  tab3Root = DiscountsPage;

  constructor() {

  }

}
