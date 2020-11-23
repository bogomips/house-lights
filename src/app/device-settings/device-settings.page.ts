import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-device-settings',
  templateUrl: './device-settings.page.html',
  styleUrls: ['./device-settings.page.scss'],
})
export class DeviceSettingsPage implements OnInit {

  inputSelected;
  formDevice = new FormGroup({
    name: new FormControl("", [Validators.required]),
    type: new FormControl("", [Validators.required]),
    host: new FormControl("", [Validators.required]),
    port: new FormControl("", [Validators.required])
  })

  constructor() { }

  ngOnInit() {
  }

  inputColorChange(val){
    this.inputSelected=true;
  }

  submit(){
    console.log('shit');
    this.formDevice.markAllAsTouched();
    if (this.formDevice.valid) {
      console.log('whatever ',this.formDevice.getRawValue());
      // this.sending = true;
      // let ret = await this.apiService.contactUs(this.form.getRawValue());
      // this.emailSent = (_get(ret, 'data.sendContact') == 'true') ? true : false;
      // this.sending = false;
    }
  }

}
