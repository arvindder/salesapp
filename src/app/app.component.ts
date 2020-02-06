import { Component } from '@angular/core';

import { Platform, AlertController,MenuController,Events } from '@ionic/angular';
import { Router } from '@angular/router'
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoginService } from './api/login.service'
import { OneSignal } from '@ionic-native/onesignal/ngx'
import { BackgroundMode } from '@ionic-native/background-mode/ngx'
import { Vibration } from '@ionic-native/vibration/ngx';

declare var cordova:any
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    public appPages = [
        {
            title: 'Log In',
            url: '/login',
            icon: 'log-in'
        },
        {
            title: 'Lead List',
            url: '/leadllist',
            icon: 'list'
        },
        {
            title: 'Lead Accept',
            url: '/leadalert',
            icon: 'call'
        },
        {
            title: 'Profile',
            url: '/profile',
            icon: 'person'
        }
        ,
        {
            title: 'Lead Activity Log',
            url: '/activitylog',
            icon: 'person'
        },
        {
            title: 'Lead Accept Success',
            url: '/leadacceptsuccess',
            icon: 'person'
        },
        {
            title: 'Lead Accept Failed',
            url: '/leadacceptfailed',
            icon: 'person'
        }
    ];

    public leadComing: boolean = false;
    public leadData: any;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private oneSignal: OneSignal,
        private alertCtrl: AlertController,
        private backgroundMode: BackgroundMode,
    public menuCtrl: MenuController,
    public events: Events,
    public vibration: Vibration
    ) {


        this.backgroundMode.enable();
        this.backgroundMode.excludeFromTaskList();
        // this.backgroundMode.overrideBackButton();
        // this.backgroundMode.setDefaults({silent: true});

        // cordova.plugins.backgroundMode.on('activate', function(){
        //     console.log("hai")
        // })

        // this.backgroundMode.onactivate

        this.initializeApp();
        this.events.subscribe('leadComing', (data) => {
                this.leadComing = data.leadComing;
                this.leadData = data.leadData;
                if(this.leadComing){
                  this.vibration.vibrate([2000,1000,2000,1000,2000,1000,2000]);
                  setTimeout( () => {
                    this.leadClose();
                  }, 10000);
                }
        });
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.setupPush();
      this.menuCtrl.enable(false);
        });
    }

    leadClose()
    {
        this.vibration.vibrate(0);
        this.events.publish('leadComing', { leadComing: false, leadData: {} });
    }


    setupPush() {
        // I recommend to put these into your environment.ts
        this.oneSignal.startInit('7725e010-fd6c-4eba-bd0e-1853b47547b6', '441235747442');

        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);

        // Notifcation was received in general
        this.oneSignal.handleNotificationReceived().subscribe(data => {
            console.log(data)
            this.backgroundMode.wakeUp()
            this.backgroundMode.unlock();
            this.backgroundMode.moveToForeground();
            let msg = data.payload.body;
            let title = data.payload.title;
            let additionalData = data.payload.additionalData;
            this.showAlert(title, msg, additionalData.task);
        });

        // Get FCMToken and UserId
        this.oneSignal.getIds().then((data)=>{
            localStorage.setItem('fcmToken', data.pushToken)
            localStorage.setItem('fcmUserId', data.userId)
        })

        // Notification was really clicked/opened
        this.oneSignal.handleNotificationOpened().subscribe(data => {
            // Just a note that the data is a different place here!
            console.log(data)
            let additionalData = data.notification.payload.additionalData;

            this.showAlert('Notification opened', 'You already read this before', additionalData.task);
        });

        this.oneSignal.endInit();
    }


    async showAlert(title, msg, task) {
        const alert = await this.alertCtrl.create({
            header: title,
            subHeader: msg,
            buttons: [
                {
                    text: `Action: ${task}`,
                    handler: () => {
                        // E.g: Navigate to a specific screen
                    }
                }
            ]
        })
        alert.present();
    }
}
