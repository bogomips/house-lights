import { Component, OnInit,ViewChild } from '@angular/core';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.page.html',
  styleUrls: ['./device-list.page.scss'],
})
export class DeviceListPage implements OnInit {

 // @ViewChild('sliding') sliding;

  constructor() { }

  ngOnInit() {
  }

  // async slideDrag(ev){
  //   //console.log("sliding" ,ev);
  //   //let amount=await this.sliding.getOpenAmount();
  //   let ratio=await this.sliding.getSlidingRatio()
  //   console.log(ratio);
  //   if (ratio < -3 ) console.log("I start the function I Want from left !");
  //   if (ratio > 3 ) console.log("I start the function I Want from right !");

  //   if (ratio == 1 || ratio == -1)
  //     await this.sliding.close();


  // }

}
