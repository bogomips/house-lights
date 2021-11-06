// import _ from 'lodash';
// //import bytes from 'bytes';
// //import fs from 'fs';
// import path from 'path';
// const __dirname = path.resolve();
import { v4 as uuidv4 } from 'uuid';

//import devicesSetup from "controllers/devicesSetup.mjs";
//{"devices":[{"id":"21ce4140-3b15-11ec-b34d-ad389033cd0d","name":"night","type":"udp","host":"192168.1.239","port":"4210",
//"supportscolors":false,"supportsbrightness":true,"customonoff":false,"oncmd":"","offcmd":"","active":true,"power":true}],"power":true,"mode":"basic","selectedColor":{"hsl":{"h":104,"s":100,"l":49},"hex":"43fa00","rgb":{"r":67,"g":250,"b":0}},"presetColors":[{"hsl":{"h":0,"s":100,"l":50},"buttonStatus":false},{"hsl":{"h":50,"s":100,"l":50},"buttonStatus":false},{"hsl":{"h":100,"s":100,"l":50},"buttonStatus":false},{"hsl":{"h":175,"s":100,"l":50},"buttonStatus":false},{"hsl":{"h":200,"s":100,"l":50},"buttonStatus":false},{"hsl":{"h":275,"s":100,"l":50},"buttonStatus":false},{"hsl":{"h":300,"s":100,"l":50},"buttonStatus":false},{"hsl":{"h":330,"s":100,"l":50},"buttonStatus":false}]}
const devicesArray = [
    {
        id: uuidv4(),
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
        id: uuidv4(),
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
        id: uuidv4(),
        name: 'lib',
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
        id: uuidv4(),
        name: 'node',
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
        id: uuidv4(),
        name: 'kit',
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
        id: uuidv4(),
        name: 'bar',
        type: 'udp',
        host: '192.168.1.239',
        port: '4210',
        supportscolors: false,
        supportsbrightness: false,
        customonoff: true,
        oncmd: 'open',
        offcmd: 'close',
        active: false
    }
    
];

const config = {
    port: 8088,
    devicesSetup: devicesArray
};

export default config;
