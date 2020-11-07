import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
//import { ColorPickerModule } from 'ngx-color-picker';






@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    //ColorPickerModule
    // ColorSketchModule,
    // ColorAlphaModule,
    // ColorBlockModule,
    // ColorChromeModule,
    // ColorCircleModule,
    // ColorCompactModule,
    // ColorGithubModule,
    // ColorHueModule,
    // ColorMaterialModule,
    // ColorPhotoshopModule,
    // ColorSketchModule,
    // ColorSliderModule,
    // ColorSwatchesModule,
    // ColorTwitterModule,
    // ColorShadeModule
    //TinyColor
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
