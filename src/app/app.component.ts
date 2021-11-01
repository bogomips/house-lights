import { Component, ViewChild } from '@angular/core';

import { IonRouterOutlet,Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Plugins } from '@capacitor/core';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { Device } from '@ionic-native/device/ngx';

import { ApiService } from './services/api.service'

const { App } = Plugins;



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  @ViewChild(IonRouterOutlet, { static : true }) routerOutlet: IonRouterOutlet;


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private backgroundGeolocation: BackgroundGeolocation,
    private api:ApiService,
    private device: Device
    //private routerOutlet: IonRouterOutlet

  ) {

    
    // PP 2266a759fc4d05a2
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 0, //BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 10,
      debug: false, 
      startOnBoot: true,
      interval: 10000,
      notificationsEnabled: false,
      stopOnTerminate: false, 
      url:'http://home.petrelli.biz:8888',
      postTemplate: {
        id:	'@id',
        provider: '@provider',
        locationProvider: '@locationProvider',
        time: '@time',
        latitude: '@latitude',
        longitude: '@longitude',
        accuracy: '@accuracy',
        speed: '@speed',
        altitude: '@altitude',
        bearing: '@bearing',
        isFromMockProvider: '@isFromMockProvider',
        mockLocationsEnabled: '@mockLocationsEnabled',
        device: {
          uuid:this.device.uuid,
          model:this.device.model
        }
      }
    };


    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        App.exitApp();
      }
    });

    this.backgroundGeolocation.configure(config).then(() => {


      /*
      location	Location	all	all	on location update
      stationary	Location	all	DIS,ACT	on device entered stationary mode
      activity	Activity	Android	ACT	on activity detection
      error	{ code, message }	all	all	on plugin error
      authorization	status	all	all	on user toggle location service
      start		all	all	geolocation has been started
      stop		all	all	geolocation has been stopped
      foreground		Android	all	app entered foreground state (visible)
      background		Android	all	app entered background state
      abort_requested		all	all	server responded with "285 Updates Not Required"
      http_authorization
      */

      this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {        
              
        console.log("2!************ ",JSON.stringify(location));
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  ");

        const data2serv = {
          ...location,
          device: {
            uuid:this.device.uuid,
            model:this.device.model
          }
        }
        
        this.api.sendLoc(data2serv);
        
        //this.backgroundGeolocation.finish(); // FOR IOS ONLY
      });      


      this.backgroundGeolocation.on(BackgroundGeolocationEvents.stationary).subscribe((location) => {        
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ stationary");
        console.log(location);
      });

      this.backgroundGeolocation.on(BackgroundGeolocationEvents.error).subscribe((error) => {        
        console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ error");
        console.log(error);
      });

      this.backgroundGeolocation.on(BackgroundGeolocationEvents.start).subscribe(() => {        
        console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ start");
      });

      this.backgroundGeolocation.on(BackgroundGeolocationEvents.stop).subscribe(() => {        
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ stop");        
      });

      this.backgroundGeolocation.on(BackgroundGeolocationEvents.authorization).subscribe((status) => {        
        console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ authorization");     
        console.log(status);   
      });

      this.backgroundGeolocation.on(BackgroundGeolocationEvents.background).subscribe(() => {        
        console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ background");     
        
      });

      this.backgroundGeolocation.on(BackgroundGeolocationEvents.foreground).subscribe(() => {        
        console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ foreground");     
        
      });

      this.backgroundGeolocation.on(BackgroundGeolocationEvents.abort_requested).subscribe(() => {        
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ abort_requested");     
      });

      this.backgroundGeolocation.on(BackgroundGeolocationEvents.http_authorization).subscribe(() => {        
        console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ http_authorization");     
      });


    });

    this.initializeApp();  
    this.backgroundGeolocation.start();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}

