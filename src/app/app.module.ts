import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import  firebase  from 'firebase';

import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Dialogs } from '@ionic-native/dialogs';
import { SocialSharing } from '@ionic-native/social-sharing';

import { Stripe } from '@ionic-native/stripe';

import { AgmCoreModule } from '@agm/core';

import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

import { FCM } from '@ionic-native/fcm';

export const firebaseConfig = {
  apiKey: "AIzaSyCnsnRnjlqsMRO4jQLwFk3HzH8r-eMDiNk",
  authDomain: "test1-51a17.firebaseapp.com",
  databaseURL: "https://test1-51a17.firebaseio.com",
  projectId: "test1-51a17",
  storageBucket: "test1-51a17.appspot.com",
  messagingSenderId: "718835534496"
};

firebase.initializeApp(firebaseConfig);


import { MyApp }                        from './app.component';
// import { SplashContentPage }            from './app.component';

import { IntroPage }                    from '../pages/intro/intro';

import { TabsPage }                     from '../pages/tabs/tabs';

import { LoginPage }                    from '../pages/login/login';
import { SignupPage }                   from '../pages/signup/signup';
import { OnBoardPage }                  from '../pages/on-board/on-board';

import { AccountPage }                  from '../pages/account/account';
import { RecentPage }                   from '../pages/recent/recent';
import { FavoritesPage }                from '../pages/favorites/favorites';
import { NearMePage }                   from '../pages/nearMe/nearMe';

import { RestaurantPage, DiscountPage } from '../pages/restaurant-page/restaurant-page';

import { RestaurantPortalPage }         from '../pages/restaurant-portal/restaurant-portal';

import { MenuPage, ModalContentPage }   from '../pages/menu/menu';

import { InfoPage }                     from '../pages/info/info';
import { DiscountsPage }                from '../pages/discounts/discounts';

import { User }                         from '../providers/user';
import { FcmNotifications }             from '../providers/fcm-notifications';
import { Map }                          from '../providers/map';
import { SettingsProvider } from '../providers/settings/settings';

@NgModule({
  declarations: [
    MyApp,
    IntroPage,
    // SplashContentPage,
    TabsPage,
    LoginPage,
    SignupPage,
    AccountPage,
    RecentPage,
    FavoritesPage,
    NearMePage,
    RestaurantPage,
    DiscountPage,
    OnBoardPage,
    RestaurantPortalPage,
    MenuPage,
    ModalContentPage,
    InfoPage,
    DiscountsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCnsnRnjlqsMRO4jQLwFk3HzH8r-eMDiNk'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    IntroPage,
    // SplashContentPage,
    TabsPage,
    LoginPage,
    SignupPage,
    AccountPage,
    RecentPage,
    FavoritesPage,
    NearMePage,
    RestaurantPage,
    DiscountPage,
    OnBoardPage,
    RestaurantPortalPage,
    MenuPage,
    ModalContentPage,
    InfoPage,
    DiscountsPage
  ],
  providers: [
    Camera,
    Geolocation,
    Diagnostic,
    Dialogs,
    SocialSharing,
    User,
    FCM,
    FcmNotifications,
    Map,
    StatusBar,
    LaunchNavigator,
    SplashScreen,
    SettingsProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Stripe,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
