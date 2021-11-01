import { Injectable,  } from '@angular/core';

import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { StoreService } from '../services/store.service';

import 'capacitor-udp';
//import {UdpPluginUtils, IUdpPlugin} from 'capacitor-udp';
import { Plugins } from "@capacitor/core";
const { UdpPlugin } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  /*setup = {
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
  }*/


  udpStruct={
    info:null
  };

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Access-Control-Allow-Origin' : '*',
  //     'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
  //     //'Authorization' : 'Bearer ' + this.token,
  //     //'Content-Type': 'application/json'
  //   })
  // };

  constructor(
    private http: HttpClient,    
    private storeService:StoreService,

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

  // async sentToTypeDevices(datas,type,skipPower = false) {

  //   //const state =this.state.getButtonState();
  //   const appStore = await this.storeService.get();
    
  //   if (!skipPower && !appStore.power)
  //     return;

  //   for (let device of appStore.devices) {
  //     if (device.type == type && device.active) {
  //       for (let data of datas) { 
  //         if (type == 'udp')
  //           this.sendUpd(data,device); 
  //       }
  //     }
  //   }
  // }

  async sendCommands(params) { //console.log(params)
    
    const appStore = await this.storeService.get();
    let commands=[];
    //console.log(appStore)
    for (let device of appStore.devices) { //console.log(device)

      if (!device.active)
        continue;
      
      if ('power' in params && typeof params.power === "boolean")  { 
                  
        if (device.customonoff) {
          const commandonoff =  (params.power) ? device.oncmd : device.offcmd;
          commands.push(commandonoff)
        }
        else if (device.supportscolors) { 

          const colorOn = appStore.selectedColor.hex || 'FF1486'; 
          const color =  (!appStore['power']) ? '000000' : colorOn; 
          
          if (appStore.mode == 'basic') {
            commands.push('basic');
            commands.push(`0x${color}`);
          }
          else  
            commands.push(device.mode);   
        } 
        else if (device.supportsbrightness) {
          commands.push(`0x6`);
        }           

      }

      if ('mode' in params && params.mode && appStore.power)
        commands.push(params.mode);              
      
      if ('color' in params && params.color && device.supportscolors && appStore.power) 
        commands.push(`0x${params.color}`);
      
      if ('color' in params && params.color && device.supportsbrightness && appStore.power) {
        const val = (params.slidesLevels.l < 6) ? 6 : params.slidesLevels.l;
        commands.push(`0x${val}`);
      }
      
     
      for (let command of commands) { 

        //console.log(command,device.type) 
        if (device.type == 'udp')
          this.sendUpd(command,device);  

        else if (device.type == 'http') {
          const url = `http://${device.host}:${device.port}/${command}`; 
          this.http.get(url).subscribe((data: any) => console.log(data));
        }

      }
      
    }                
    
  }

  async sendUpd(data,device) { //console.log(">>>",data);
    
    try {       
      await UdpPlugin.send({ socketId: this.udpStruct.info.socketId, address: device.host, port: parseInt(device.port), buffer: btoa(data)});   
    } catch(e) {
      //console.log(e);
    }

  } 


  async sendLoc(location) { //console.log(">>>",data);

    const url = `http://home.petrelli.biz:8888/`; 
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    //this.http.post(url).subscribe((data: any) => console.log(data));
    console.log("sending....")
    let ret = this.http.post(url, location, httpOptions).subscribe((data: any) => {      
      console.log("inside returning...")
      console.log("b-RET>>>",JSON.stringify(data)); 
    });
    //console.log(">> ret call ... ", JSON.stringify(ret));
    

 }


}
