import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
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

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public events: Events) {
    this.initializeApp();

    this.pages = [
      { title: 'Near Me', component: TabsPage },
      { title: 'Login', component: LoginPage },
      { title: 'Signup', component: SignupPage }
    ]

    events.subscribe('user:loggedIn', (loggedIn) => {
      this.loggedIn = loggedIn;
      this.pages = [
        {title: 'Near Me', component: TabsPage },
        {title: 'Logout', component: this.loggedIn }
      ];
    });

    events.subscribe('user:loggedOut', (loggedOut) =>{
      this.loggedIn = loggedOut;
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
        this.events.publish('user:loggedOut', false);
      }).catch(function(error) {
        console.log(error.message);
      });

    } else {
      this.nav.setRoot(page.component);
    }
  }
}
