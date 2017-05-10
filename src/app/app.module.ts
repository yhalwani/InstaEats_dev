import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import  firebase  from 'firebase';

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


import { MyApp }          from './app.component';
import { TabsPage }       from '../pages/tabs/tabs';

import { LoginPage }      from '../pages/login/login';
import { SignupPage }     from '../pages/signup/signup';
import { OnBoardPage }    from '../pages/on-board/on-board';

import { RecentPage }     from '../pages/recent/recent';
import { FavoritesPage }  from '../pages/favorites/favorites';
import { NearMePage }     from '../pages/nearMe/nearMe';

import { RestaurantPage } from '../pages/restaurant-page/restaurant-page'

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    LoginPage,
    SignupPage,
    RecentPage,
    FavoritesPage,
    NearMePage,
    RestaurantPage,
    OnBoardPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCfjCqsLgu2mYhxquylBJRzwEfgUIUQD30'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    LoginPage,
    SignupPage,
    RecentPage,
    FavoritesPage,
    NearMePage,
    RestaurantPage,
    OnBoardPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
