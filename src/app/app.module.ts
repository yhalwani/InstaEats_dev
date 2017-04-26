import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { GoogleMaps } from '@ionic-native/google-maps';
import  firebase  from 'firebase';


export const firebaseConfig = {
  apiKey: "AIzaSyCnsnRnjlqsMRO4jQLwFk3HzH8r-eMDiNk",
  authDomain: "test1-51a17.firebaseapp.com",
  databaseURL: "https://test1-51a17.firebaseio.com",
  projectId: "test1-51a17",
  storageBucket: "test1-51a17.appspot.com",
  messagingSenderId: "718835534496"
};

firebase.initializeApp(firebaseConfig);


import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';

import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';

import { RecentPage } from '../pages/recent/recent';
import { FavoritesPage } from '../pages/favorites/favorites';
import { NearMePage } from '../pages/nearMe/nearMe';

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
    RestaurantPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
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
    RestaurantPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
