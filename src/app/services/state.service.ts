import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  state={};

  constructor(   
  ) {}

  
  
  setButtonState(state) {
  
    this.state['power']=state.power;

    for (let button of state.buttons) {
      this.state[button.station] = button.active;
    }

  }
  
  getButtonState() {
    return this.state;
  }

}
