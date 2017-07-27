import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import  firebase  from 'firebase';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { Stripe } from '@ionic-native/stripe';

import { AgmCoreModule } from 'angular2-google-maps/core';


export const firebaseConfig = {
  apiKey: "AIzaSyAfjgkS5zm-LsPjbaikBlDd9tihvQTBRTg",
  authDomain: "instaeats-a06a3.firebaseapp.com",
  databaseURL: "https://instaeats-a06a3.firebaseio.com",
  projectId: "instaeats-a06a3",
  storageBucket: "instaeats-a06a3.appspot.com",
  messagingSenderId: "538741031345"
};

firebase.initializeApp(firebaseConfig);


import { MyApp }                from './app.component';
import { SplashContentPage }    from './app.component';

import { TabsPage }             from '../pages/tabs/tabs';

import { LoginPage }            from '../pages/login/login';
import { SignupPage }           from '../pages/signup/signup';
import { OnBoardPage }          from '../pages/on-board/on-board';

import { RecentPage }           from '../pages/recent/recent';
import { FavoritesPage }        from '../pages/favorites/favorites';
import { NearMePage }           from '../pages/nearMe/nearMe';

import { RestaurantPage }   from '../pages/restaurant-page/restaurant-page';

import { RestaurantPortalPage } from '../pages/restaurant-portal/restaurant-portal';

import { MenuPage }       from '../pages/menu/menu';
import { ModalContentPage } from '../pages/menu/menu';

import { InfoPage }       from '../pages/info/info';
import { DiscountsPage }  from '../pages/discounts/discounts';


@NgModule({
  declarations: [
    MyApp,
    SplashContentPage,
    TabsPage,
    LoginPage,
    SignupPage,
    RecentPage,
    FavoritesPage,
    NearMePage,
    RestaurantPage,
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
      apiKey: 'AIzaSyAfjgkS5zm-LsPjbaikBlDd9tihvQTBRTg'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SplashContentPage,
    TabsPage,
    LoginPage,
    SignupPage,
    RecentPage,
    FavoritesPage,
    NearMePage,
    RestaurantPage,
    OnBoardPage,
    RestaurantPortalPage,
    MenuPage,
    ModalContentPage,
    InfoPage,
    DiscountsPage
  ],
  providers: [
    Camera,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Stripe,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
