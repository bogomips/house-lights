import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StoreService } from '../services/store.service';
import { Router,ActivatedRoute } from '@angular/router';
import * as _find from 'lodash/find';
import * as _pick from 'lodash/pick';


@Component({
  selector: 'app-device-settings',
  templateUrl: './device-settings.page.html',
  styleUrls: ['./device-settings.page.scss'],
})
export class DeviceSettingsPage implements OnInit {

  inputSelected={};
  submitted=false;
 
  formDevice = new FormGroup({
    name: new FormControl("", [Validators.required]),
    type: new FormControl("", [Validators.required]),
    host: new FormControl("", [Validators.required]),
    port: new FormControl("", [Validators.required])
  })

  constructor(
    private storeService:StoreService,
    private router: Router,
    private route: ActivatedRoute
  ) { 

  }

  async ngOnInit() {
    const deviceParam=this.route.snapshot.paramMap.get("name");
    const devices = await this.storeService.get('devices');
    const device = _find(devices, function(d) { return d.name == deviceParam });
    if (deviceParam && device)
      this.formDevice.setValue(_pick(device, ['name', 'type','host','port']));
    else if (deviceParam != 'new')
      this.router.navigate(['/device-settings','new']);
    
  }

  inputColorChange(field,val){
    this.inputSelected[field]=val;        
  }

  async submit(){
    
    this.formDevice.markAllAsTouched();
    this.submitted=true;

    if (this.formDevice.valid) {
      //console.log('whatever ',this.formDevice.getRawValue());
      await this.storeService.save('devices',this.formDevice.getRawValue());
      this.router.navigate(['/home']);      
    }    

  }

}
