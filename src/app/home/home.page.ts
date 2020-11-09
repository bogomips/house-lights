import { Component } from '@angular/core';
import {Platform } from '@ionic/angular';
import * as _chunk from 'lodash/chunk';
import { TinyColor } from '@ctrl/tinycolor';
import 'capacitor-udp';
//import {UdpPluginUtils, IUdpPlugin} from 'capacitor-udp';
import { Plugins } from "@capacitor/core";
const { UdpPlugin } = Plugins;
//import {UdpPluginUtils} from "capacitor-udp"; // if you want support for converting between ArrayBuffer and String


interface RGB {
  b: number;
  g: number;
  r: number;
}

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
  contrastThreshold;
  presetsLine=4;

  constructor(
    private platform: Platform,
  ) {

    //this.pickerWidth = this.platform.width()-50;
    //console.log(this.pickerWidth,this.pickerWidth+50)

    this.presetColors=[
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
    ];

    this.selectedColor = {
      hsl: {
        h: 0,
        s: 100, 
        l: 0
      },
      hex: '000000',
      rgb: {
        r:0,
        g:0,
        b:0
      }
    }

    this.presetColorsChunks=_chunk(this.presetColors,this.presetsLine);

  }

  colorConversion(type,value) {

    const color = new TinyColor(value);
    let format; 

    if (type == 'hex')
      format= color.toHex();
    else if (type == 'rgb')
      format= color.toRgb();

    return format;
  }

  slideChange(type,ev) {

    this.selectedColor.hsl[type]=ev.detail.value;
    this.selectedColor.hex=this.colorConversion('hex', this.selectedColor.hsl);
    this.sendUpd();

    this.selectedColor.rgb=this.colorConversion('rgb', this.selectedColor.hsl);
    this.contrast(this.selectedColor.rgb);
  }

  getCurrentHslCss() {
    return `hsl(${this.selectedColor.hsl.h},${this.selectedColor.hsl.s}%,${this.selectedColor.hsl.l}%)`;
  }

  getSaturationGradient() {
    return `linear-gradient(to left, hsl(${this.selectedColor.hsl.h},100%,50%) 20%, rgb(128, 128, 128))`;
  }

  getLuminanceGradient() {
    return `linear-gradient(to right, hsl(0, 0%, 0%), hsl(${this.selectedColor.hsl.h},100%,50%), hsl(255, 50%, 100%))`;
  }

   getIndexFromRiCi(ri,ci) {
     return ((ri*this.presetsLine)+ci);
   }

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
    //let hsl = preset;
    return `hsl(${preset.hsl.h},${preset.hsl.s}%,${preset.hsl.l}%)`;
  }

  setPreset(preset,ri,ci) {

    this.selectedColor.hsl = preset.hsl;
    let index = this.getIndexFromRiCi(ri,ci);

    let i=0;
    for (let preset of this.presetColors) {

      if (preset.buttonStatus && index!==i )
        preset.buttonStatus=false;

      i++;
    }
    preset.buttonStatus=!preset.buttonStatus;
  }

  rgbToYIQ({ r, g, b }: RGB): number { 
    return ((r * 299) + (g * 587) + (b * 114)) / 1000;
  }

  contrast(colorRgb: RGB) {
    this.contrastThreshold = this.rgbToYIQ(colorRgb); //>= threshold ? '#000' : '#fff';
    //console.log(this.contrastThreshold);
  }


  async sendUpd() {

    const targetAddress='192.168.1.232';
    const targetPort=4210;
    let color = `0x${this.selectedColor.hex}`; 

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
