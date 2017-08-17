import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }


  navSignUp() {
    this.navCtrl.setRoot(SignupPage);
  }


  navLogin() {
    this.navCtrl.setRoot(LoginPage);
  }


  navHome() {
    this.navCtrl.setRoot(TabsPage);
  }

}
