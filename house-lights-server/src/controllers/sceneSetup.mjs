import config from '../config.mjs';
import got from 'got';
import buffer from 'buffer';
import dgram from 'dgram';

const setDevice = async (device,setup) => { 

    const { name, type, host, port, oncmd, offcmd, supportscolors, supportsbrightness } = device;

    if (type === 'http') {
        try { 
            const command = (setup.power) ? oncmd : offcmd;
            const { data } = await got.get(`http://${host}:${port}/${command}`);
            //console.log(data)
        }
        catch(e) {
            console.log(e);
        }
    }
    else if (type === 'udp') {

        const udpClient = dgram.createSocket('udp4');
        let data;
        //console.log(setup);
        if (supportscolors) 
            data = (setup.power) ? Buffer.from(setup.color) : Buffer.from('0x000000');
        else if (supportsbrightness) 
            data = (setup.power) ? Buffer.from(setup.brightness) : Buffer.from('0x10');

        udpClient.send(data,port,host,function(error){
            if (error)
                udpClient.close();                   
        });

    }
}

const applyDeviceScene = async (sceneDevices) => { 

    for (let device of config.devicesSetup) {
        
        const sceneDevice = sceneDevices.filter((d) => d.name === device.name);
        //console.log(sceneDevice);
        if (!sceneDevice.length)
            await setDevice(device,{power: false  });
        else
            await setDevice(device, {power: true, ...sceneDevice[0] });
    }
    
}


const sceneSetup = async (ctx, next) => {

    const sceneName = ctx.params.name;
    const sceneObj = config.scenesSetup[sceneName];

    await applyDeviceScene(sceneObj.devices)
    ctx.body = 'success';
};

export default sceneSetup;