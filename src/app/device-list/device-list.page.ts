import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.page.html',
  styleUrls: ['./device-list.page.scss'],
})
export class DeviceListPage implements OnInit {

  @ViewChild('devicelist') devicelist;

  devices=[];

   constructor(
    private router: Router,
    private alertController:AlertController,
    private storeService:StoreService,
  ) { 
  }

  async ngOnInit() {
    this.devices = await this.storeService.get('devices'); 
  }

  slideDrag(device,ev) {
    device['sliderFullyOpened'] = (ev.detail.ratio >= 1) ? true : false;
  }

  async editCallback(device){
    
    await this.devicelist.closeSlidingItems();
    device['sliderFullyOpened']=false;
    this.router.navigate(['/device-settings',device.name]);
  }
    
  async deleteCallback(device){
    let store = await this.storeService.delete({type:'devices',data:device},true);   
    this.devices = store.devices;
  }

  async deleteAlert(device) {
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
          handler: () => this.deleteCallback(device)
        }
      ]
    });

    await alert.present();
  }


}
