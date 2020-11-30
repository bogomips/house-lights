import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StoreService } from '../services/store.service';
import { Router,ActivatedRoute } from '@angular/router';
import * as _find from 'lodash/find';
import * as _pick from 'lodash/pick';
import { v1 as uuidv1 } from 'uuid';


@Component({
  selector: 'app-device-settings',
  templateUrl: './device-settings.page.html',
  styleUrls: ['./device-settings.page.scss'],
})
export class DeviceSettingsPage implements OnInit {

  inputSelected={};
  submitted=false;
  
  formDevice = new FormGroup({
    id: new FormControl("", [Validators.required]),
    name: new FormControl("", [Validators.required]),
    type: new FormControl("", [Validators.required]),
    host: new FormControl("", [Validators.required]),
    port: new FormControl("", [Validators.required]),
    supportscolors: new FormControl(true, [Validators.required]),
    customonoff: new FormControl(false, [Validators.required]),
    oncmd: new FormControl(""),
    offcmd: new FormControl(""),
  })

  constructor(
    private storeService:StoreService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    
  }

  async ngOnInit() {

    const deviceParam=this.route.snapshot.paramMap.get("id");
    const devices = await this.storeService.get('devices');
    const device = _find(devices, function(d) { return d.id == deviceParam });

    //console.log(deviceParam, device)

    if (deviceParam && device) 
      this.formDevice.patchValue(_pick(device, ['id','name', 'type','host','port','supportscolors','customonoff','oncmd','offcmd']));  
    else if (deviceParam != 'new')
      this.router.navigate(['/device-settings','new']);    
    else     
      this.formDevice.patchValue({id:uuidv1()});

      console.log(this.formDevice)
  }

  customonoffChange() {

    if (this.formDevice.controls.customonoff.value) {
      this.formDevice.get('oncmd').setValidators([Validators.required]);
      this.formDevice.get('offcmd').setValidators([Validators.required]);
    }
    else {
      this.formDevice.get('oncmd').clearValidators();
      this.formDevice.get('offcmd').clearValidators();
    }

    this.formDevice.get('oncmd').updateValueAndValidity();
    this.formDevice.get('offcmd').updateValueAndValidity();

  }


  inputColorChange(field,val){
    this.inputSelected[field]=val;        
  }

  async submit() {
    
    this.formDevice.markAllAsTouched();
    this.submitted=true;
    
    if (this.formDevice.valid) {
      //console.log('formData ',this.formDevice.getRawValue());
      await this.storeService.save('devices',this.formDevice.getRawValue());
      this.router.navigate(['/home']);      
    }    

  }

}
