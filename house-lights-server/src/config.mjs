// import _ from 'lodash';
// //import bytes from 'bytes';
// //import fs from 'fs';
// import path from 'path';
// const __dirname = path.resolve();
//import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';
//import devicesSetup from "controllers/devicesSetup.mjs";
//{"devices":[{"id":"21ce4140-3b15-11ec-b34d-ad389033cd0d","name":"night","type":"udp","host":"192168.1.239","port":"4210",
//"supportscolors":false,"supportsbrightness":true,"customonoff":false,"oncmd":"","offcmd":"","active":true,"power":true}],"power":true,"mode":"basic","selectedColor":{"hsl":{"h":104,"s":100,"l":49},"hex":"43fa00","rgb":{"r":67,"g":250,"b":0}},"presetColors":[{"hsl":{"h":0,"s":100,"l":50},"buttonStatus":false},{"hsl":{"h":50,"s":100,"l":50},"buttonStatus":false},{"hsl":{"h":100,"s":100,"l":50},"buttonStatus":false},{"hsl":{"h":175,"s":100,"l":50},"buttonStatus":false},{"hsl":{"h":200,"s":100,"l":50},"buttonStatus":false},{"hsl":{"h":275,"s":100,"l":50},"buttonStatus":false},{"hsl":{"h":300,"s":100,"l":50},"buttonStatus":false},{"hsl":{"h":330,"s":100,"l":50},"buttonStatus":false}]}

const devicesArray = [
    {
        id: '',
        name: 'table',
        type: 'udp',
        host: '192.168.1.15',
        port: '4210',
        supportscolors: true,
        supportsbrightness: false,
        customonoff: false,
        oncmd: '',
        offcmd: '',
        active: false
    },
    {
        id: '',
        name: 'night',
        type: 'udp',
        host: '192.168.1.239',
        port: '4210',
        supportscolors: false,
        supportsbrightness: true,
        customonoff: false,
        oncmd: '',
        offcmd: '',
        active: false
    },
    {
        id: '',
        name: 'wall',
        type: 'udp',
        host: '192.168.1.233',
        port: '4210',
        supportscolors: true,
        supportsbrightness: false,
        customonoff: false,
        oncmd: '',
        offcmd: '',
        active: false
    },
    {
        id: '',
        name: 'desk',
        type: 'udp',
        host: '192.168.1.237',
        port: '4210',
        supportscolors: true,
        supportsbrightness: false,
        customonoff: false,
        oncmd: '',
        offcmd: '',
        active: false
    },
    {
        id: '',
        name: 'node',
        type: 'udp',
        host: '192.168.1.238',
        port: '4210',
        supportscolors: true,
        supportsbrightness: false,
        customonoff: false,
        oncmd: '',
        offcmd: '',
        active: false
    },
    {
        id: '',
        name: 'kitchen',
        type: 'udp',
        host: '192.168.1.236',
        port: '4210',
        supportscolors: true,
        supportsbrightness: false,
        customonoff: false,
        oncmd: '',
        offcmd: '',
        active: false
    },
    {
        id: '',
        name: 'bar',
        type: 'http',
        host: '192.168.1.230',
        port: '80',
        supportscolors: false,
        supportsbrightness: false,
        customonoff: true,
        oncmd: 'open',
        offcmd: 'close',
        active: false
    },
    {
        id: '',
        name: 'lello',
        type: 'http',
        host: '192.168.1.234',
        port: '80',
        supportscolors: false,
        supportsbrightness: false,
        customonoff: true,
        oncmd: 'on',
        offcmd: 'off',
        active: false
    }

];

const scenesArray = { 
    'night': {
        devices: [
            {
                name:'desk',
                color:'0x110000'
            },
            {
                name:'table',
                color:'0xff0000'
            },
            {
                name:'node',
                color:'0x001100'
            },
            {
                name:'night',
                brightness: '0x20'
            }
        ]
    },
    'sun': {
        devices: [
            {
                name:'bar',                
            },
            {
                name:'lello',
            },
            {
                name:'wall',
                color: '0xffd500'
            },
            {
                name:'kitchen',
                color: '0xffd500'
            },
            {
                name:'desk',
                color: '0x0044ff'
            },
            {
                name:'node',
                color: '0x1aff00'
            }
        ]
    },
    'evening': {
        devices: [
            {
                name:'bar',                
            },
            {
                name:'lello',
            },
            {
                name:'wall',
                color: '0x702b00'
            },
            {
                name:'kitchen',
                color: '0x15ff00'
            },
            {
                name:'desk',
                color: '0xff0037'
            },
            {
                name:'node',
                color: '0x0040ff'
            },
            {
                name:'night',
                brightness: '0x50'
            }
        ]
    }
}



for (let device of devicesArray) {
    device.id = createHash('sha256').update(`${device.ip}:${device.port}:${device.name}`).digest('base64');
}

const config = {
    port: 8088,
    udpPort: 4210,
    devicesSetup: devicesArray,
    scenesSetup: scenesArray,
    deCONZapi: {
        endpoint: 'http://192.168.1.2',
        port: 40850
    }
};

export default config;
