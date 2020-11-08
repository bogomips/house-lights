import { Component } from '@angular/core';
import {Platform } from '@ionic/angular';
import * as _chunk from 'lodash/chunk';
import { TinyColor } from '@ctrl/tinycolor';
import 'capacitor-udp';
//import {UdpPluginUtils, IUdpPlugin} from 'capacitor-udp';
import { Plugins } from "@capacitor/core";
const { UdpPlugin } = Plugins;
//import {UdpPluginUtils} from "capacitor-udp"; // if you want support for converting between ArrayBuffer and String

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  presetColors;
  presetColorsChunks;
  //pickerWidth;
  selectedColor;
  presetsLine=4;

  constructor(
    private platform: Platform,
  ) {

    //this.pickerWidth = this.platform.width()-50;
    //console.log(this.pickerWidth,this.pickerWidth+50)

    this.presetColors=[
      {hsl: {h: 0, s: 100, l: 50,}},
      {hsl: {h: 50, s: 100, l: 50,}},
      {hsl: {h: 100, s: 100, l: 50,}},
      {hsl: {h: 175, s: 100, l: 50,}},
      {hsl: {h: 200, s: 100, l: 50,}},
      {hsl: {h: 275, s: 100, l: 50,}},
      {hsl: {h: 300, s: 100, l: 50,}},
      {hsl: {h: 330, s: 100, l: 50,}}
    ];

    this.selectedColor = {
      h: 0,
      s: 100, 
      l: 50,
    }

    this.presetColorsChunks=_chunk(this.presetColors,this.presetsLine);
    //console.log(this.presetColorsChunks);

    //this.selectedColor=this.presetColors.preset1;
    //let a= document.getElementsByClassName('color-picker')
    
    //console.log(a);

  }

  // handleChange(ev) {
  //   console.log(ev)
  //   this.presetColors[0].hsl=ev.color.hsl;
  //   //console.log(this.presetColors)
  // }

  /*presetColorsArr() {
    return this.presetColors.map(obj => obj.hsl);
  }*/

  colorConversion(type,value) {

    const color = new TinyColor(value);
    let format; 

    if (type == 'hex')
      format= color.toHex();
    else if (type == 'rgb')
      format= color.toRgbString();

    return format;
  }

  slideChange(type,ev) {
    this.selectedColor[type]=ev.detail.value;
    this.sendUpd();
  }

  getCurrentHslCss() {
    return `hsl(${this.selectedColor.h},${this.selectedColor.s}%,${this.selectedColor.l}%)`;
  }

  getSaturationGradient() {
    return `linear-gradient(to left, hsl(${this.selectedColor.h},100%,50%) 20%, rgb(128, 128, 128))`;
  }

  getLuminanceGradient() {
    return `linear-gradient(to right, hsl(0, 0%, 0%), hsl(${this.selectedColor.h},100%,50%), hsl(255, 50%, 100%))`;
  }

  // getIndexFromRiCi(ri,ci) {
  //   return ((ri*this.presetsLine)+ci);
  // }

  // getPreset(ri,ci) {
  //   let index = this.getIndexFromRiCi(ri,ci)
  //   //console.log(ri,ci,index);
  //   let hsl = this.presetColors[index].hsl;
  //   return `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`;
  // }

  // setPreset(ri,ci) {
  //   let index = this.getIndexFromRiCi(ri,ci)
  //   this.selectedColor = this.presetColors[index].hsl;
  // }

  getPreset(preset) {
    let hsl = preset.hsl;
    return `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`;
  }

  setPreset(preset) {
    this.selectedColor = preset.hsl;
  }

  async sendUpd() {

    const targetAddress='192.168.1.232';
    const targetPort=4210;
    let color = `0x${this.colorConversion('hex',this.selectedColor)}`;

    try {

      await UdpPlugin.closeAllSockets();
      let info = await UdpPlugin.create();
      await UdpPlugin.bind({ socketId: info.socketId, address: '127.0.0.1', port: 5510});
      await UdpPlugin.send({ socketId: info.socketId, address: targetAddress, port: targetPort, buffer: btoa(color)});
    } catch(e) {
      console.log(e);
    }


  } 

}
