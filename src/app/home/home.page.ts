import { Component, OnInit } from '@angular/core';
import {Platform } from '@ionic/angular';
import * as _chunk from 'lodash/chunk';
import * as _clone from 'lodash/clone';
//import { TinyColor } from '@ctrl/tinycolor';
import { AlertController } from '@ionic/angular';
import { ColorsService } from '../services/colors.service';
import { ApiService } from '../services/api.service'
//import { StateService } from '../services/state.service'
import { StoreService } from '../services/store.service';

//import {UdpPluginUtils} from "capacitor-udp"; // if you want support for converting between ArrayBuffer and String


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  //presetColors;
  modes;
  //nightmode;
  mode='basic';
  presetColorsChunks;
  //pickerWidth;
  //selectedColor;
  switchButtons;
  appStore;
  
  powerOn:boolean=true;  ///PLEASE DELETE ME!!!!!!
  contrastThreshold;
  presetsLine=4;

  constructor(
    private platform: Platform,
    private alertController:AlertController,
    private colors: ColorsService,
    private api:ApiService,
    //private state:StateService,
    private storeService:StoreService,

  ) {

    //this.pickerWidth = this.platform.width()-50;
    //console.log(this.pickerWidth,this.pickerWidth+50)
          
    this.modes =[
      {
        name: 'Basic',
        value: 'basic',
      },
      {
        name: 'Rainbow',
        value: 'rainbow',
      },
      {
        name: 'Night mode',
        value: 'nightmode',
      },
      {
        name: 'Meteor',
        value: 'meteorrain',
      },
      {
        name: 'New Kitt',
        value: 'newkitt',
      },
      {
        name: 'Disco',
        value: 'disco',
      },
      {
        name: 'Strobo',
        value: 'strobo',
      }
    ] 

    // this.presetColorsChunks=_chunk(this.presetColors,this.presetsLine);
    //this.state.setButtonState({power: this.powerOn, buttons:this.switchButtons});

  }

  async ngOnInit() {

    this.appStore = await this.storeService.get(); 
    this.presetColorsChunks=_chunk(this.appStore.presetColors,this.presetsLine);
    this.storeService.appStoreChanged().subscribe((appStore) => {                                 
      //console.log("Att store changed ",appStore);      
      this.appStore=appStore;   
    });          

  }

  saveColor() {
    this.storeService.save('selectedColor',this.appStore.selectedColor);
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

  modeChange() {
    this.api.sendCommands({mode:this.mode});
    this.storeService.save('mode',this.mode); //save the whole device
  }

  deviceActiveToggle(i) { 
    this.appStore.devices[i].active = !this.appStore.devices[i].active;
    this.appStore.devices[i].power = this.powerOn;
    this.storeService.save('devices',this.appStore.devices[i]);
  }

  setColorHsl(type,value) {
    
    if (type == 'all')
      this.appStore.selectedColor.hsl=value; 
    else
      this.appStore.selectedColor.hsl[type]=value; 

    this.appStore.selectedColor.hex=this.colorConversion('hex', this.appStore.selectedColor.hsl);
    this.appStore.selectedColor.rgb=this.colorConversion('rgb', this.appStore.selectedColor.hsl);
    this.api.sendCommands({color:this.appStore.selectedColor.hex,slidesLevels:this.appStore.selectedColor.hsl});    
  }

  setColorHex(value) {
    
    this.appStore.selectedColor.hex=value.replace(/^#/i, '');        
    this.appStore.selectedColor.hsl = this.colors.hexToHsl(this.appStore.selectedColor.hex);    
    this.appStore.selectedColor.rgb=this.colorConversion('rgb', this.appStore.selectedColor.hsl);
    this.api.sendCommands({color:this.appStore.selectedColor.hex});
  }

  setColorRgb(value) {
        
    this.appStore.selectedColor.rgb=value;
    const hslArr = this.colors.rgbToHsl(value.r,value.g,value.b);    
    this.appStore.selectedColor.hsl={h:Math.round(hslArr[0]*360),s:Math.round(hslArr[1]*100),l:Math.round(hslArr[2]*100)};    
    this.appStore.selectedColor.hex=this.colorConversion('hex', this.appStore.selectedColor.hsl);

    this.api.sendCommands({color:this.appStore.selectedColor.hex});
  }

  slideChange(type,ev) {

    if (this.mode != 'basic') {
      this.mode='basic';
      this.modeChange();
    }

    this.setColorHsl(type,ev.detail.value);
    this.contrast(this.appStore.selectedColor.rgb);
  }

  getCurrentHslCss() { 
    return `hsl(${this.appStore.selectedColor.hsl.h},${this.appStore.selectedColor.hsl.s}%,${this.appStore.selectedColor.hsl.l}%)`;
  }

  getSaturationGradient() {
    return `linear-gradient(to left, hsl(${this.appStore.selectedColor.hsl.h},100%,50%) 20%, rgb(128, 128, 128))`;
  }

  getLuminanceGradient() {
    return `linear-gradient(to right, hsl(0, 0%, 0%), hsl(${this.appStore.selectedColor.hsl.h},100%,50%), hsl(255, 50%, 100%))`;
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
  //   this.appStore.selectedColor = this.presetColors[index].hsl;
  // }

// alerts // 
isValidHsl(value) {
  const hslArr = value.split('-');  
  return ( (hslArr[0] >= 0 && hslArr[0] <= 360) && (hslArr[1] >= 0 && hslArr[1] <= 100) && (hslArr[2] >= 0 && hslArr[2] <= 100) );
}

isValidRgb(value) { 
  const rgbArr = value.split('-'); 
  return ( (rgbArr[0] >= 0 && rgbArr[0] <= 255) && (rgbArr[1] >= 0 && rgbArr[1] <= 255) && (rgbArr[2] >= 0 && rgbArr[2] <= 255) );
}

async colorInputAlert(type) {

    let header, name, placeholder;

    if (type == 'hex') {
      header='Type a hex color';
      name='HEX';
      placeholder='#FF0023';
    }
    else if (type == 'hsl') {
      header='Type a hsl color';
      name='HSL';
      placeholder='0-50-100';
    }
    else if (type == 'rgb') { 
      header='Type a rgb color';
      name='RGB';
      placeholder='255-255-255';
    }

    const alert = await this.alertController.create({
      cssClass: 'hexIput',
      header: header,
      inputs: [
        {
          name: name,
          placeholder: placeholder
        }],
      buttons: [
        {
          text: 'apply',
          cssClass: 'hexInputBtn',
          handler: (value) => {                  
            
            if ((type == 'hex') && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.HEX))  {              
              this.setColorHex(value.HEX);
            }
            else if ((type == 'hsl') && this.isValidHsl(value.HSL)) {

              const hslArr = value.HSL.split('-');              
              this.setColorHsl('all',{h:hslArr[0],s:hslArr[1],l:hslArr[2]});

            }
            else if ((type == 'rgb') && this.isValidRgb(value.RGB)) {

              const rgbArr = value.RGB.split('-');                   
              this.setColorRgb({r:rgbArr[0],g:rgbArr[1],b:rgbArr[2]});

            }
          }
        }
      ]
    });

    await alert.present();
  }

  getPreset(preset) {
    return `hsl(${preset.hsl.h},${preset.hsl.s}%,${preset.hsl.l}%)`;
  }

  setPreset(preset,ri,ci) {

    let index = this.getIndexFromRiCi(ri,ci);

    let i=0;
    for (let preset of this.appStore.presetColors) {

      if (preset.buttonStatus && index!==i )
        preset.buttonStatus=false;

      i++;
    }
    preset.buttonStatus=!preset.buttonStatus;

    if (!preset.buttonStatus)
      preset.hsl=_clone(this.appStore.selectedColor.hsl);
    else
      this.appStore.selectedColor.hsl = _clone(preset.hsl);

    this.saveColor();

  }

  contrast(colorRgb) {
    this.contrastThreshold = this.colors.rgbToYIQ(colorRgb);
  }
  
  powerToggle() {
    this.powerOn=!this.powerOn;
    this.api.sendCommands({power:this.powerOn});
    this.storeService.save('power',this.powerOn);
  }


}
