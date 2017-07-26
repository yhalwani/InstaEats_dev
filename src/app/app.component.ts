import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, LoadingController, ToastController, ModalController, ViewController }  from 'ionic-angular';
import { StatusBar }    from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage }      from '@ionic/storage';

import firebase         from 'firebase';

import { TabsPage }     from '../pages/tabs/tabs';
import { OnBoardPage }  from '../pages/on-board/on-board';
import { LoginPage }    from '../pages/login/login';
import { SignupPage }   from '../pages/signup/signup';

import { RestaurantPortalPage } from '../pages/restaurant-portal/restaurant-portal'

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
    public storage: Storage
  ) {

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
        {title: 'My Account', component: this.rootPage },
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
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();

      // this.splashScreen.show();
      // this.splashScreen.hide();

      let splash = this.modalCtrl.create(SplashContentPage);
      splash.present();

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

};


@Component({
  template: `
  <ion-content>

    <svg id="ClockWork" xmlns="http://www.w3.org/2000/svg" width="329.8" height="329.8" viewBox="0 0 329.8 329.8" style="padding:20px; width:200px;">
      <title>InstaEats-ClockWork</title>
      <g id="_12" data-name="12">
        <path id="_Path_" data-name="&lt;Path&gt;" d="M249.2,103.6h-4v16.2h8V103.7h-4Z" transform="translate(-84.3 -85.2)" fill="#fff"/>
      </g>
      <g id="_11" data-name="11">
        <path id="_Path_2" data-name="&lt;Path&gt;" d="M177.9,121.3c-2.3,1.4-4.7,2.7-7.1,4l8.1,14.3,7.1-4Z" transform="translate(-84.3 -85.2)" fill="#fff"/>
      </g>
      <g id="_10" data-name="10">
        <path id="_Path_3" data-name="&lt;Path&gt;" d="M126.2,172.1q-2,3.6-4.2,7l14.1,8.5q2.2-3.4,4.2-7Z" transform="translate(-84.3 -85.2)" fill="#fff"/>
      </g>
      <g id="_9" data-name="9">
        <path id="_Path_4" data-name="&lt;Path&gt;" d="M104.8,246.1c0,1.3-.1,2.7-0.1,4s0.1,2.7.1,4h16.2c0-1.3-.1-2.7-0.1-4s0.1-2.7.1-4H104.8Z" transform="translate(-84.3 -85.2)" fill="#fff"/>
      </g>
      <g id="_8" data-name="8">
        <path id="_Path_5" data-name="&lt;Path&gt;" d="M135.6,309.8l-14.1,8c1.3,2.4,2.6,4.7,4,7l14.1-8C138.2,314.6,136.9,312.2,135.6,309.8Z" transform="translate(-84.3 -85.2)" fill="#fff"/>
      </g>
      <g id="_7" data-name="7">
        <path id="_Path_6" data-name="&lt;Path&gt;" d="M179.4,357.8l-8.4,13.9,6.9,4.2,8.4-13.9q-3.5-2-6.9-4.2h0Z" transform="translate(-84.3 -85.2)" fill="#fff"/>
      </g>
      <g id="_6" data-name="6">
        <path id="_Path_7" data-name="&lt;Path&gt;" d="M245.2,378.4v16.2h8V378.4h-8Z" transform="translate(-84.3 -85.2)" fill="#fff"/>
      </g>
      <g id="_5" data-name="5">
        <path id="_Path_8" data-name="&lt;Path&gt;" d="M316,359.8c-2.3,1.4-4.6,2.7-7,4l8,14.1,7-4Z" transform="translate(-84.3 -85.2)" fill="#fff"/>
      </g>
      <g id="_4" data-name="4">
        <path id="_Path_9" data-name="&lt;Path&gt;" d="M361.2,313q-2,3.5-4.2,6.9l13.9,8.4q2.2-3.4,4.2-6.9Z" transform="translate(-84.3 -85.2)" fill="#fff"/>
      </g>
      <g id="_3" data-name="3">
        <path id="_Path_10" data-name="&lt;Path&gt;" d="M382.8,245.8c0,1.4-.1,2.7-0.1,4.1s0.1,2.7.1,4.1h16.4c0-1.4-.1-2.7-0.1-4.1s0.1-2.7.1-4.1H382.8Z" transform="translate(-84.3 -85.2)" fill="#fff"/>
      </g>
      <g id="_2" data-name="2">
        <path id="_Path_11" data-name="&lt;Path&gt;" d="M373.1,175.3l-14.1,8c1.4,2.3,2.7,4.6,4,7l14.1-8C375.8,180,374.4,177.6,373.1,175.3Z" transform="translate(-84.3 -85.2)" fill="#fff"/>
      </g>
      <g id="_1" data-name="1">
        <path id="_Path_12" data-name="&lt;Path&gt;" d="M320.6,124.3l-8.4,13.9q3.5,2,6.9,4.2l8.4-13.9Z" transform="translate(-84.3 -85.2)" fill="#fff"/>
      </g>
      <g id="Fork">
        <path id="_Path_13" data-name="&lt;Path&gt;" d="M399,226.3a4.7,4.7,0,0,1,4.7,5.2,4.9,4.9,0,0,1-5,4.3H365.9v9.4h32.8a4.9,4.9,0,0,1,4.9,4.3,4.7,4.7,0,0,1-4.7,5.1H365.9V264h32.8a4.9,4.9,0,0,1,4.9,4.3,4.7,4.7,0,0,1-4.7,5.1H342.3a14.2,14.2,0,0,1-14.2-14.3v-1.5H328l-61.4,5a13,13,0,0,1-2-26h2l61.4,5.3h0.1v-1.5a14.2,14.2,0,0,1,14.3-14.2H399Z" transform="translate(-84.3 -85.2)" fill="#fff"/>
      </g>
      <g id="Knife">
        <path id="_Path_14" data-name="&lt;Path&gt;" d="M264.9,100.9a4.8,4.8,0,0,0-4.8-4.8,24,24,0,0,0-24,24v43.2a9.6,9.6,0,0,0,9.6,9.6h3.2l-10.2,61.5a13.2,13.2,0,1,0,26.3,2.2V100.9Z" transform="translate(-84.3 -85.2)" fill="#fff"/>
      </g>
      <g id="ClockBorder">
        <path id="_Path_15" data-name="&lt;Path&gt;" d="M249.2,85.2c-91,0-164.9,73.9-164.9,164.9S158.2,415,249.2,415s164.9-73.9,164.9-164.9S340.3,85.2,249.2,85.2Zm0,8A156.9,156.9,0,1,1,92.4,250.1,156.8,156.8,0,0,1,249.2,93.2Z" transform="translate(-84.3 -85.2)" fill="#fff"/>
      </g>
    </svg>

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

    // (function() {
    //   var animation = new svgAnimation({
    //     canvas: 		  Snap('#canvas'),
    //     svg: 					'assets/svg/InstaEats-ClockWork.svg',
    //     data: 				'assets/json/clockWork.json',
    //     duration: 		5000,
    //     steps: 				1
    //   });
    // })();


    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, 4000);

  }


};
