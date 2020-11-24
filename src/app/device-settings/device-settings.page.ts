import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StoreService } from '../services/store.service';
import { Router } from '@angular/router';


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
    private router: Router
  ) { }

  async ngOnInit() {
    //let subSim={name: "bar", type: "udp", host: "192.144.34.3", port: "4210"};
    //await this.storeService.delete({type:'devices',data:{name: "bar", type: "udp", host: "192.144.34.3", port: "4210"}});    
    //let a= await this.storeService.get();    
    //console.log(a);
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
