import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginService } from './api/login.service'
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx'
import { HTTP } from '@ionic-native/http/ngx'

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    OneSignal,
    BackgroundMode,
    HTTP,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  LoginService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
