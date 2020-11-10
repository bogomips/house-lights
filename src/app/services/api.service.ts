import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import 'capacitor-udp';
//import {UdpPluginUtils, IUdpPlugin} from 'capacitor-udp';
import { Plugins } from "@capacitor/core";
const { UdpPlugin } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  setup = {
    bar: { 
      endpoint:'http://192.168.1.230/'
    },
    bed: {
      endpoint:'192.168.1.232',
      port:4210
    }
  }

  constructor(
    private http: HttpClient
  ) { 

  }


  barSignSwitch(status) {
    status = (status ) ? 'open' : 'close';
    let endpoint = this.setup.bar.endpoint+status;
    this.http.get(endpoint) .subscribe((data: any) => console.log(data));
  }

  generalPowerStatus(status) {
    
    this.barSignSwitch(status);

    const hexCol =  (!status) ? '000000' : 'FF07B';
    this.sendUpd(hexCol);
  }

  async sendUpd(colorHex) {

    let color = `0x${colorHex}`; 

    try {

      await UdpPlugin.closeAllSockets();
      let info = await UdpPlugin.create();
      await UdpPlugin.bind({ socketId: info.socketId, address: '127.0.0.1', port: 5510});
      await UdpPlugin.send({ socketId: info.socketId, address: this.setup.bed.endpoint, port: this.setup.bed.port, buffer: btoa(color)});
    } catch(e) {
      console.log(e);
    }

  } 



}
