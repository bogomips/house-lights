import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.page.html',
  styleUrls: ['./device-list.page.scss'],
})
export class DeviceListPage implements OnInit {

  @ViewChild('devicelist') devicelist;
  sliderFullyOpened=true;

  constructor(
    private router: Router,
    private alertController:AlertController
  ) { }

  ngOnInit() {
  }

  slideDrag(ev) {
    //console.log("sliding ",ev);
    this.sliderFullyOpened = (ev.detail.ratio >= 1) ? false : true;
  }

  editCallback(){
    //console.log('pipina')
    this.devicelist.closeSlidingItems();
    this.sliderFullyOpened=true;
    this.router.navigate(['/device-settings']);
  }
    
  async deleteCallback(){
    //console.log('pipina');
    await this.presentAlert();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //this.alertController.dismiss();
          }
        }, {
          text: 'OK',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }


}
