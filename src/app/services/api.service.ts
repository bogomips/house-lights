import { Injectable } from '@angular/core';

import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import 'capacitor-udp';
//import {UdpPluginUtils, IUdpPlugin} from 'capacitor-udp';
import { Plugins } from "@capacitor/core";
const { UdpPlugin } = Plugins;

import { StateService } from '../services/state.service'



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
    },
    //generalPowerStatus:true,
    lastColor:'',
  }

  udpStruct={
    info:null
  };

  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
      //'Authorization' : 'Bearer ' + this.token,
      //'Content-Type': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
    private state:StateService
  ) { 

    this.setUdp();
  }

  async setUdp() {

    try {
    
      await UdpPlugin.closeAllSockets();
      this.udpStruct.info = await UdpPlugin.create();
      await UdpPlugin.bind({ socketId: this.udpStruct.info.socketId, address: '127.0.0.1', port: 5510});

    } catch(e) {
      console.log(e);
    }

  }


  barSignSwitch(status) {
    status = (status) ? 'open' : 'close';
    let endpoint = this.setup.bar.endpoint+status;
    this.http.get(endpoint) .subscribe((data: any) => console.log(data));
  }

  generalPowerStatus() {
    
      const state =this.state.getButtonState();

      if (state['bar'])
        this.barSignSwitch(state['power']);

      if (state['bed']) { 
        this.sendUpd('basic'); //cannot use the setMode() or it will work only when I switch the power button on!
        let colorOn = this.setup.lastColor || 'FF1486'
        const hexCol =  (!state['power']) ? '000000' : colorOn;
        this.sendUpd(`0x${hexCol}`);
      }    

    //this.setup.generalPowerStatus = status;
  }

  setColor(hexCol) {

    this.setup.lastColor=hexCol;

    const state =this.state.getButtonState();
        
    if (state['power'] && state['bed']) 
      this.sendUpd(`0x${hexCol}`); 
    
  }

  setMode(mode) { //console.log("mode >> ",mode);

    //this.setup.lastColor=colorHex;
    const state =this.state.getButtonState();  

    if (state['power'] && state['bed'])
      this.sendUpd(mode);   

  }

  private async sendUpd(data) { //console.log(data);
    
    try {
      //console.log(this.udpStruct.info.socketId)
      await UdpPlugin.send({ socketId: this.udpStruct.info.socketId, address: this.setup.bed.endpoint, port: this.setup.bed.port, buffer: btoa(data)});      

    } catch(e) {
      console.log(e);
    }

  } 



}
