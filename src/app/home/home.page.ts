import { Component } from '@angular/core';
import {Platform } from '@ionic/angular';
import * as _chunk from 'lodash/chunk';
import * as _clone from 'lodash/clone';
//import { TinyColor } from '@ctrl/tinycolor';

import { ColorsService } from '../services/colors.service';
import { ApiService } from '../services/api.service'
import { StateService } from '../services/state.service'

//import {UdpPluginUtils} from "capacitor-udp"; // if you want support for converting between ArrayBuffer and String


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  presetColors;
  modes;
  presetColorsChunks;
  //pickerWidth;
  selectedColor;
  switchButtons;
  
  powerOn:boolean=true;  ///PLEASE DELETE ME!!!!!!
  contrastThreshold;
  presetsLine=4;

  constructor(
    private platform: Platform,
    private colors: ColorsService,
    private api:ApiService,
    private state:StateService
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

    this.switchButtons = [
      {
        station: 'bar',
        icon: '/assets/svg/noun_beer mug_1028502.svg',
        active:false
      },
      {
        station: 'table',
        icon:'/assets/svg/noun_Ceiling lamp_1842794.svg',
        active:false
      },
      {
        station: 'wall',
        icon:'/assets/svg/noun_Couch_3243381.svg',
        active:false
      },
      {
        station: 'bed',
        icon:'/assets/svg/noun_Love_2195485.svg',
        active:false
      }

    ]
          
    this.modes =[
      {
        name: 'None',
        value: 'none',
      },
      {
        name: 'Rainbow',
        value: 'rainbow',
      },
      {
        name: 'Disco',
        value: 'disco',
      }
    ] 

    this.presetColorsChunks=_chunk(this.presetColors,this.presetsLine);
    this.state.setButtonState({power: this.powerOn, buttons:this.switchButtons});
    


  }

  colorConversion(type,colorHsl) {

    //const color = new TinyColor(value);
    let { h,s,l } = colorHsl;
    let format; 

    if (type == 'hex')
      format= this.colors.hslToHex(h,s,l);
    else if (type == 'rgb')
      format= this.colors.hslToRgb(h,s,l);

    return format;
  }

  toolbarToggle(i) {
    this.switchButtons[i].active = ! this.switchButtons[i].active;
    this.state.setButtonState({power: this.powerOn, buttons:this.switchButtons});
  }

  slideChange(type,ev) {

    this.selectedColor.hsl[type]=ev.detail.value;
    this.selectedColor.hex=this.colorConversion('hex', this.selectedColor.hsl);
    this.api.setColor(this.selectedColor.hex);

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

    let index = this.getIndexFromRiCi(ri,ci);

    let i=0;
    for (let preset of this.presetColors) {

      if (preset.buttonStatus && index!==i )
        preset.buttonStatus=false;

      i++;
    }
    preset.buttonStatus=!preset.buttonStatus;

    if (!preset.buttonStatus)
      preset.hsl=_clone(this.selectedColor.hsl);
    else
      this.selectedColor.hsl = _clone(preset.hsl);

  }

  contrast(colorRgb) {
    this.contrastThreshold = this.colors.rgbToYIQ(colorRgb);
  }
  

  powerToggle() {
    this.powerOn=!this.powerOn;
    this.state.setButtonState({power: this.powerOn, buttons:this.switchButtons});
    this.api.generalPowerStatus();
  }


}
