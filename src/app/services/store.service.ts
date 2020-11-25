import { splitClasses } from '@angular/compiler';
import { Injectable } from '@angular/core';
import * as _remove from 'lodash/remove';
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;
import * as _findIndex from 'lodash/findIndex';


interface Store {
  devices: any[];
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  store:Store={
    //devices: [{name: "bar", type: "udp", host: "192.144.34.3", port: "4210"},{name: "wall", type: "udp", host: "192.144.34.4", port: "4210"}],  
    devices: [],  
  }

  storageRetrieved=false; //SET TO FALSE AFTER TESTS!!!

  constructor() { }

  async save(type,data) {   

    if (type == 'devices') {
      const devInd = _findIndex(this.store.devices,(d) => (d.name == data.name) );

      if (devInd > -1)
        this.deleteDevice(this.store.devices[devInd]);

    }

    this.store[type].push(data);
    await this.permanentSave();
  }

  async get(type=null) {
    if (this.storageRetrieved)
      return (type) ? this.store[type] : this.store;
    else {
      const appStorage = await Storage.get({key:'appStorage'});  
      this.store = JSON.parse(appStorage.value);
      this.storageRetrieved=true;
      return this.get(type);
    }        
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

