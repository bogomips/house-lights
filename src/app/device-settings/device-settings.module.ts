import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeviceSettingsPageRoutingModule } from './device-settings-routing.module';

import { DeviceSettingsPage } from './device-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DeviceSettingsPageRoutingModule
  ],
  declarations: [DeviceSettingsPage]
})
export class DeviceSettingsPageModule {}
