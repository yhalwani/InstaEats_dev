import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, LoadingController, ToastController, ModalController, ViewController, AlertController }  from 'ionic-angular';
import { StatusBar }    from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Dialogs }      from '@ionic-native/dialogs';
import { Storage }      from '@ionic/storage';
import { HeaderColor }  from '@ionic-native/header-color';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Intercom }     from '@ionic-native/intercom';

import firebase         from 'firebase';

import { TabsPage }             from '../pages/tabs/tabs';
import { AccountPage }          from '../pages/account/account';
import { OnBoardPage }          from '../pages/on-board/on-board';
import { LoginPage }            from '../pages/login/login';
import { SignupPage }           from '../pages/signup/signup';
import { IntroPage }            from '../pages/intro/intro';
import { RestaurantPortalPage } from '../pages/restaurant-portal/restaurant-portal';
// import { StripePage }        from '../pages/stripe/stripe';

import { User }                 from '../providers/user';
import { FcmNotifications }     from '../providers/fcm-notifications';
import { Map }                  from '../providers/map';
import { SettingsProvider }     from './../providers/settings/settings';

declare var Snap,svg,easing,min,js: any;
declare var svgTween: any;
declare var svgAnimation: any;

declare var window;
declare var intercom;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage  : any = TabsPage;
  loginPage : any = LoginPage;
  loggedIn  : any = false;
  menuTitle : any = "InstaEats";

  pages:          Array<{title: string, component: any}>;
  selectedTheme:  String;
  showedAlert:    boolean;


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
    private dialogs: Dialogs,
    private headerColor: HeaderColor,
    public alert: AlertController,
    private iab: InAppBrowser,
    private intercom: Intercom
  ) {

    this.initializeApp();


    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);

    this.pages = [
      { title: 'Feed Me!', component: this.rootPage },
      { title: 'Login', component: LoginPage },
      { title: 'Signup', component: SignupPage },
      { title: 'Restaurant Owners', component: OnBoardPage}
    ];

    events.subscribe('user:loggedIn', (loggedIn, username) => {
      this.loggedIn = loggedIn;
      this.rootPage = TabsPage;
      this.menuTitle = username;
      this.pages = [
        {title: 'Feed Me!', component: this.rootPage },
        {title: 'Account', component: AccountPage },
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
        { title: 'Restaurant Owners', component: OnBoardPage}
      ];
        if (this.platform.is('cordova')) {
          intercom.reset();
          intercom.setLauncherVisibility('GONE');
        } else {
          window.Intercom('shutdown');
        }
    });

    events.subscribe('restaurant:loggedIn', (loggedIn, username) => {
      this.loggedIn = loggedIn;
      this.menuTitle = username;
      this.rootPage = RestaurantPortalPage;
      this.pages = [
        {title: 'Restaurant Portal', component: this.rootPage},
        // {title: 'Payment', component: StripePage},
        {title: 'Logout', component: this.loggedIn}
      ];
    });

  };

  openInAppBrowser(){
    if(this.platform.is('core')){
      const browser = this.iab.create('http://instaeats.com/terms-and-policies.html');
    }
    else{
      const browser = this.iab.create('http://instaeats.com/terms-and-policies.html', '_self');
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      setTimeout(() => {
        this.splashScreen.hide();
      }, 1000);

      this.map.getLocationServices();
      this.headerColor.tint('#da3937');

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

      // keep user logged in on refresh
      let user = firebase.auth().currentUser;
      if(user){
        // check if restaurant
        firebase.database().ref("Restaurant Profiles/").once('value', (snapshot) => {
          if(snapshot.hasChild(user.uid)){
            this.events.publish('restaurant:loggedIn', true, user.displayName);
            this.settings.setActiveTheme('restaurant-theme');
          } else {

          }
        })
        // check if userRef
        firebase.database().ref("User Profiles/").once('value', (snapshot) => {
          if(snapshot.hasChild(user.uid)){
            this.userService.user.email = user.email;
            this.userService.user.loggedIn = true;
            this.userService.user.username = user.displayName;
            this.events.publish('user:loggedIn', true, user.displayName);
          } else {

          }
        })
      }
      else {
        this.events.publish('app:launch', this.loggedIn);
      }

      // Confirm exit
      this.platform.registerBackButtonAction(() => {
        if (this.nav.length() == 1) {
          if (!this.showedAlert) {
            this.confirmExitApp();
          } else {
            this.showedAlert = false;
          }
        }

        this.nav.pop();
      });
    });

    this.userService.updateBundleStatus();
  };

  confirmExitApp() {
    this.showedAlert = true;
    let confirmAlert = this.alert.create({
        title: "Exit",
        message: "Are you sure you want to exit the app?",
        buttons: [
            {
                text: 'Cancel',
                handler: () => {
                    this.showedAlert = false;
                    return;
                }
            },
            {
                text: 'Exit',
                handler: () => {
                    this.platform.exitApp();
                }
            }
        ]
    });
    confirmAlert.present();
  }

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
