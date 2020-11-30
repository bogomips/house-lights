import { splitClasses } from '@angular/compiler';
import { Injectable } from '@angular/core';
import * as _remove from 'lodash/remove';
import * as _findIndex from 'lodash/findIndex';
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

import { Observable, Subject } from 'rxjs';


interface Hsl {
  h: number
  s: number 
  l: number
}

interface Rgb {
  r: number 
  g: number 
  b: number
}

interface PresetColor { 
  hsl: Hsl
  buttonStatus:boolean
}

interface Modes { 
  name: String
  value: String
}

interface SelectedColor {
  hsl: Hsl
  hex: String
  rgb: Rgb    
}
enum ConnectionType {
  'upd',
  'tcp',
  'http'  
}

interface Device { 
  id: String
  name: String
  type: ConnectionType
  host: String
  port: number
  mode: String
  active: boolean
}

interface Store {
  devices: Device[]
  power: boolean
  presetColors: PresetColor[]
  selectedColor: SelectedColor  
  mode: String
  //presetModes: Modes[]
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  store:Store;
  storeUpdated = new Subject();   

  storeRetrieved=false; 

  constructor() {

    this.store={
      //devices: [{name: "bar", type: "udp", host: "192.144.34.3", port: "4210"},{name: "wall", type: "udp", host: "192.144.34.4", port: "4210"}],  
      devices: [],  
      power: true,
      mode: 'basic',
      selectedColor: {
        hsl: { h: 0, s: 100,  l: 0 },
        hex: '000000',
        rgb: {  r:0, g:0, b:0 }
      },
      presetColors: [
        {
          hsl: {h: 0, s: 100, l: 50,},
          buttonStatus:false
        },
        {
          hsl: {h: 50, s: 100, l: 50,},
          buttonStatus:false
        },
        {
          hsl: {h: 100, s: 100, l: 50,},
          buttonStatus:false
        },
        {
          hsl: {h: 175, s: 100, l: 50,},
          buttonStatus:false
        },
        {
          hsl: {h: 200, s: 100, l: 50,},
          buttonStatus:false
        },
        {
          hsl: {h: 275, s: 100, l: 50,},
          buttonStatus:false
        },
        {
          hsl: {h: 300, s: 100, l: 50,},
          buttonStatus:false
        },
        {
          hsl: {h: 330, s: 100, l: 50,},
          buttonStatus:false
        }
      ]
    }
  }

  saveToActiveDevices(type,data) {   

    for (let device of this.store.devices) {
      if (device.active)
        device[type]=data;
    }

  }

  async save(type,data) {   
    
    if (type == 'devices') {
      const devInd = _findIndex(this.store.devices,(d) => (d.id == data.id) );

      if (devInd > -1)
        this.store.devices[devInd]=data;          
      else 
        this.store[type].push(data);
    }
    else if (type == 'mode') {
      this.saveToActiveDevices(type,data);
      this.store[type]=data;
    }
    else
      this.store[type]=data;
    // else if (type == 'power') {
    //   this.store.power=data;
    // }
    // else if (type == 'presetColors') 

    await this.permanentSave();
    this.storeUpdated.next(this.store);
  }

  appStoreChanged() {   
    return new Observable((observer:any) => {    
      this.storeUpdated.subscribe((value) => {                           
        observer.next(value);                
      });          
    });    
  }

  async retrieveStorage() {
    const appStorage = await Storage.get({key:'appStorage'}); 
    const appStorageObj =  JSON.parse(appStorage.value);
    if (appStorageObj)
      this.store = appStorageObj;

    this.storeRetrieved=true;
  }

  async get(type=null) { 

    if (!this.storeRetrieved) 
        await this.retrieveStorage();
    
    return (type) ? this.store[type] : this.store;
    
  }

  async permanentSave() {
    await Storage.set({key:'appStorage', value:JSON.stringify(this.store)});
  }

  async deleteDevice(device) {  
    _remove(this.store.devices,{name:device.name});        
  }

  async delete(optObj,returnObj:boolean=false) {

    if (optObj.type == 'devices')
      this.deleteDevice(optObj.data);

    await this.permanentSave();

    if (returnObj)
      return this.store;

  }

}

