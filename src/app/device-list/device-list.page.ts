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

  async editCallback(device){ console.log(device)
    
    await this.devicelist.closeSlidingItems();
    device['sliderFullyOpened']=false;
    this.router.navigate(['/device-settings',device.id]);
  }
    
  async deleteCallback(device){
    let store = await this.storeService.delete({type:'devices',data:device},true);   
    this.devices = store.devices;
  }

  async deleteAlert(device) {
    const alert = await this.alertController.create({
      cssClass: 'alertDeleteMsg',
      subHeader: 'Delete device',
      message: 'Are you want to delete this device?',
      buttons: [
        {
          text: 'Oops',
          role: 'cancel',
          cssClass: 'alertDeleteBtn',
          handler: () => {
            //this.alertController.dismiss();
            this.devicelist.closeSlidingItems();
            device['sliderFullyOpened']=false;
          }
        }, {
          text: 'Yes!',
          handler: () => this.deleteCallback(device)
        }
      ]
    });

    await alert.present();
  }


}
