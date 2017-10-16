import { SettingsProvider } from './../providers/settings/settings';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, LoadingController, ToastController, ModalController, ViewController }  from 'ionic-angular';
import { StatusBar }    from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Dialogs }      from '@ionic-native/dialogs';
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
import { FcmNotifications }     from '../providers/fcm-notifications';
import { Map }          from '../providers/map';

declare var Snap,svg,easing,min,js: any;
declare var svgTween: any;
declare var svgAnimation: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage  : any = TabsPage;
  selectedTheme: String;
  loginPage : any = LoginPage;
  loggedIn  : any = false;
  menuTitle : any = "InstaEats";

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private settings: SettingsProvider,
    public events: Events,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public storage: Storage,
    public userService: User,
    public map: Map,
    public fcm: FcmNotifications,
    private dialogs: Dialogs
  ) {

    this.statusBar.hide();
    this.initializeApp();
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);


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
        {title: 'Logout', component: this.loggedIn }
      ];
    });

    events.subscribe('user:loggedOut', (loggedOut) =>{
      this.loggedIn = loggedOut;
      this.menuTitle = "InstaEats";
      this.rootPage = TabsPage;
      this.settings.setActiveTheme('user-theme');
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
      setTimeout(() => {
        this.splashScreen.hide();
      }, 1000);

      this.map.getLocationServices();

      // let splash = this.modalCtrl.create(SplashContentPage);
      // splash.present();

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

      this.fcm.init();

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
        this.nav.setRoot(TabsPage);
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

//
// @Component({
//   template: `
//   <ion-content>
//
//     <div id="custom-overlay">
//       <div id="canvas"></div>
//     </div>
//
//   </ion-content>
//   `
// })
// export class SplashContentPage {
//
//   constructor(
//     public viewCtrl: ViewController,
//     public splashScreen: SplashScreen
//   ) {
//
//   };
//
//   ionViewDidEnter() {
//
//     this.splashScreen.hide();
//
//     (function() {
//       var animation = new svgAnimation({
//         canvas: 		  Snap('#canvas'),
//         svg: 					'assets/svg/InstaEats-ClockWork.svg',
//         data: 				'assets/svg/json/clockWork.json',
//         duration: 		5000,
//         steps: 				1
//       });
//     })();
//
//     setTimeout(() => {
//       this.viewCtrl.dismiss();
//     }, 6000);
//
//   }
//
// };
