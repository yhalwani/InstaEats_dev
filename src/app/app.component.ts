import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, LoadingController, ToastController, ModalController, ViewController }  from 'ionic-angular';
import { StatusBar }    from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage }      from '@ionic/storage';

import firebase         from 'firebase';

import { TabsPage }     from '../pages/tabs/tabs';
import { AccountPage }  from '../pages/account/account';
import { OnBoardPage }  from '../pages/on-board/on-board';
import { LoginPage }    from '../pages/login/login';
import { SignupPage }   from '../pages/signup/signup';

import { IntroPage }    from '../pages/intro/intro';

import { RestaurantPortalPage } from '../pages/restaurant-portal/restaurant-portal';

import { User }         from '../providers/user';

declare var Snap,svg,min,js: any;
declare var Snap,svg,easing,min,js: any;
declare var svgTween,js: any;
declare var svgAnimation,js: any;

declare var FCMPlugin;

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
    public modalCtrl: ModalController,
    public storage: Storage,
    public userService: User
  ){

    this.initializeApp();

    this.pages = [
      { title: 'Feed Me!', component: this.rootPage },
      { title: 'Login', component: LoginPage },
      { title: 'Signup', component: SignupPage },
      { title: 'Signup Your Restaurant!', component: OnBoardPage}
    ];

    events.subscribe('user:loggedIn', (loggedIn, username) => {
      this.loggedIn = loggedIn;
      this.menuTitle = username;
      this.pages = [
        {title: 'Feed Me!', component: this.rootPage },
        {title: 'My Account', component: AccountPage },
        {title: 'Logout', component: this.loggedIn }
      ];
    });

    events.subscribe('user:loggedOut', (loggedOut) =>{
      this.loggedIn = loggedOut;
      this.menuTitle = "InstaEats";
      this.rootPage = TabsPage;
      this.pages = [
        { title: 'Feed Me!', component: this.rootPage },
        { title: 'Login', component: LoginPage },
        { title: 'Signup', component: SignupPage },
        { title: 'Signup Your Restaurant!', component: OnBoardPage}
      ];
    });

    events.subscribe('restaurant:loggedIn', (loggedIn, username) => {
      this.loggedIn = loggedIn;
      this.menuTitle = username;
      this.rootPage = RestaurantPortalPage;
      this.pages = [
        {title: 'Restaurant Portal', component: this.rootPage},
        {title: 'Logout', component: this.loggedIn}
      ];
    });

  };

  initializeApp() {
    this.platform.ready().then(() => {

      // this.statusBar.styleDefault();
      // this.splashScreen.show();
      // this.splashScreen.hide();

      let splash = this.modalCtrl.create(SplashContentPage);
      splash.present();

      this.storage.ready().then(() => {
        this.storage.length().then((numOfKeys) => {
          if (numOfKeys < 1) {
            this.rootPage = IntroPage;
            var list = [];
            this.storage.set('favList', list);
            this.storage.set('favCount', 0);
            this.storage.set('recentList', list);
            this.storage.set('recentCount', 0);
          };
        });
      });

      if(typeof(FCMPlugin) !== "undefined"){
        alert("FCMPlugin defined");
        FCMPlugin.getToken(function(t){
          alert(t);
          this.userService.user.fcmToken = t;
        }, function(e){
          alert("Uh-Oh no token!");
        });

        FCMPlugin.onNotification(function(d){
          if(d.wasTapped){
            alert(JSON.stringify(d));
          } else {
            alert(JSON.stringify(d));
          }
        }, function(msg){
          // No problemo, registered callback
          alert(msg);
        }, function(err){
          alert(err);
        });
      } else alert("Notifications disabled, only provided in Android/iOS environment");

      this.events.publish('app:launch', this.loggedIn);

    });
  };

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.component === this.loggedIn) {
      firebase.auth().signOut().then(() =>{
        this.loggedIn = false;
        this.userService.user.loggedIn = this.loggedIn;
        this.nav.setRoot(TabsPage)
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

};


@Component({
  template: `
  <ion-content>

    <div id="custom-overlay">
      <div id="canvas"></div>
    </div>

  </ion-content>
  `
})
export class SplashContentPage {

  constructor(
    public viewCtrl: ViewController,
    public splashScreen: SplashScreen
  ) {

  };

  ionViewDidEnter() {

    this.splashScreen.hide();

    (function() {
      var animation = new svgAnimation({
        canvas: 		  Snap('#canvas'),
        svg: 					'assets/svg/InstaEats-ClockWork.svg',
        data: 				'assets/svg/json/clockWork.json',
        duration: 		5000,
        steps: 				1
      });
    })();

    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, 6000);

  }

};
