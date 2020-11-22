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
    devices:[
      { 
        name: "bar",
        type:'http',
        host:'http://192.168.1.230/'
      },
      {
        name: "bed",
        type:'udp',
        host:'192.168.1.232',
        port:4210
      },
      {
        name: "wall",
        type:'udp',
        host:'192.168.1.233',
        port:4210
      }
    ],
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
    let device = this.setup.devices.find(dev => dev.name === 'bar');    
    this.http.get(device.host+status) .subscribe((data: any) => console.log(data));
  }

  sentToTypeDevices(datas,type,skipPower = false) {

    const state =this.state.getButtonState();

    if (!skipPower && !state['power'])
      return;

    for (let device of this.setup.devices) {
      if (device.type == type && state[device.name]) {
        for (let data of datas) { 
          if (type == 'udp')
            this.sendUpd(data,device); 
        }
      }
    }

  }

  generalPowerStatus() {
    
    const state =this.state.getButtonState();


    if (state['bar'])
      this.barSignSwitch(state['power']);    
        
    let colorOn = this.setup.lastColor || 'FF1486'
    const hexCol =  (!state['power']) ? '000000' : colorOn;

    let datas = ['basic',`0x${hexCol}`]
    this.sentToTypeDevices(datas,'udp',true);
    

      //let udpDevices = this.setup.devices.find(dev => dev.type === 'udp');          
  }    

    //this.setup.generalPowerStatus = status;  

  setColor(hexCol) {

    this.setup.lastColor=hexCol;

    //const state =this.state.getButtonState();
            
    let color = `0x${hexCol}`;
    this.sentToTypeDevices([color],'udp'); 
        
  }

  setMode(mode) { //console.log("mode >> ",mode);

    //this.setup.lastColor=colorHex;
    //const state =this.state.getButtonState();  

    //if (state['power'] && (state['bed'] || state['wall']))
    //  this.sendUpd(mode);   
    this.sentToTypeDevices([mode],'udp');

  }

  private async sendUpd(data,device) { //console.log(data);
    
    try { 
      //console.log(data,device.name)
      await UdpPlugin.send({ socketId: this.udpStruct.info.socketId, address: device.host, port: device.port, buffer: btoa(data)});   
    } catch(e) {
      //console.log(e);
    }

  } 



}
