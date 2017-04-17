import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;


  constructor(public navCtrl: NavController) {

  }

}
