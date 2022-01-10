import got from 'got';
import config from '../config.mjs';
//url -X PUT  -H 'Content-Type: application/json' -d '{"alert":"lselect"}' 192.168.1.2:40850/api/0EC97BE492/lights/2/state
const deCONZapi={
    //endpoint:config.deCONZapi.endpoint
};

// deCONZapi.power = async (state) => { 

//     try { 
//         const { data } = await got.put(`${config.deCONZapi.endpoint}:${config.deCONZapi.port}/api/0EC97BE492/lights/ct/state`, {
//             json: {
//                 on: state
//             }
//         }).json();

//         //console.log(data)
//     }
//     catch(e) {
//         console.log(e);
//     }

// }

deCONZapi.setColor = async (hsl_deCONZ) => {

    const { h,s,l } = hsl_deCONZ;
    //console.log(hsl_deCONZ);
    let payload={};

    if (l === 0) { 
        //deCONZapi.power(false);
         //return;    
         payload={
            on: false
         }
    }
    else {

        payload={
            on: true,
            hue: h,
            sat: s,
            bri: l,
            transitiontime: 5
        }
    }
    
    try { 
        const { data } = await got.put(`${config.deCONZapi.endpoint}:${config.deCONZapi.port}/api/0EC97BE492/lights/2/state`, {
            json: payload
        }).json();

        //console.log(data)
    }
    catch(e) {
        console.log(e);
    }
}

export default deCONZapi;