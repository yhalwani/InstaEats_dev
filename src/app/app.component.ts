import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, LoadingController, ToastController }  from 'ionic-angular';
import { StatusBar }    from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage }      from '@ionic/storage';

import firebase         from 'firebase';

import { TabsPage }     from '../pages/tabs/tabs';
import { OnBoardPage }  from '../pages/on-board/on-board';
import { LoginPage }    from '../pages/login/login';
import { SignupPage }   from '../pages/signup/signup';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage  : any = TabsPage;
  loginPage : any = LoginPage;
  loggedIn  : any = false;
  menuTitle : any = "InstaEats";

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public events: Events,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public storage: Storage
  ) {

    this.initializeApp();

    this.pages = [
      { title: 'Feed Me!', component: TabsPage },
      { title: 'Login', component: LoginPage },
      { title: 'Signup', component: SignupPage },
      { title: 'Signup Your Restaurant!', component: OnBoardPage}
    ];

    events.subscribe('user:loggedIn', (loggedIn, username) => {
      this.loggedIn = loggedIn;
      this.menuTitle = username;
      this.pages = [
        {title: 'Feed Me!', component: TabsPage },
        {title: 'Logout', component: this.loggedIn }
      ];
    });

    events.subscribe('user:loggedOut', (loggedOut) =>{
      this.loggedIn = loggedOut;
      this.menuTitle = "InstaEats";
      this.pages = [
        { title: 'Feed Me!', component: TabsPage },
        { title: 'Login', component: LoginPage },
        { title: 'Signup', component: SignupPage },
        { title: 'Signup Your Restaurant!', component: OnBoardPage}
      ];
    });

  };

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.storage.ready().then(() => {
        this.storage.length().then((numOfKeys) => {
          if (numOfKeys < 1) {
            var list = [];
            this.storage.set('favList', list);
            this.storage.set('favCount', 0);
            this.storage.set('recentList', list);
            this.storage.set('recentCount', 0);
          };
        });
      });

    });
  };

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
  };

  errToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  };

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Logout successful! Please wait...",
      duration: 2000
    });
    loader.present();
  };

}
