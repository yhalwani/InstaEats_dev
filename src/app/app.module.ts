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
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';

import { Dialogs } from '@ionic-native/dialogs';

import { Stripe } from '@ionic-native/stripe';

import { AgmCoreModule } from 'angular2-google-maps/core';


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
import { SplashContentPage }            from './app.component';

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
import { Map }                          from '../providers/map';

@NgModule({
  declarations: [
    MyApp,
    IntroPage,
    SplashContentPage,
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
    SplashContentPage,
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
    LocationAccuracy,
    Diagnostic,
    OpenNativeSettings,
    Dialogs,
    User,
    Map,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Stripe,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
