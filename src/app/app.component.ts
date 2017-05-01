import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import firebase from 'firebase';

import { TabsPage } from '../pages/tabs/tabs';

import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = TabsPage;
  loginPage:any = LoginPage;
  loggedIn : any = false;
  menuTitle : any = "InstaEats";

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public events: Events,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {

    this.initializeApp();

    this.pages = [
      { title: 'Near Me', component: TabsPage },
      { title: 'Login', component: LoginPage },
      { title: 'Signup', component: SignupPage }
    ]

    events.subscribe('user:loggedIn', (loggedIn, username) => {
      this.loggedIn = loggedIn;
      this.menuTitle = username;
      this.pages = [
        {title: 'Near Me', component: TabsPage },
        {title: 'Logout', component: this.loggedIn }
      ];
    });

    events.subscribe('user:loggedOut', (loggedOut) =>{
      this.loggedIn = loggedOut;
      this.menuTitle = "InstaEats";
      this.pages = [
        { title: 'Near Me', component: TabsPage },
        { title: 'Login', component: LoginPage },
        { title: 'Signup', component: SignupPage }
      ]
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.component === this.loggedIn) {
      firebase.auth().signOut().then(() =>{
        this.loggedIn = false;
        this.presentLoading();
        this.events.publish('user:loggedOut', false);
      }).catch((error) => {
        this.errToast(error.message);
      });

    } else {
      this.nav.setRoot(page.component);
    }
  }

  errToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Logout successful! Please wait...",
      duration: 2000
    });
    loader.present();

  }



}
