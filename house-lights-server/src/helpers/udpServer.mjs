import dgram from 'dgram';
import colors from './colors.mjs'
import deCONZapi from './deCONZapi.mjs'

const udpServer={
    server: null
};

udpServer.colorParser = async (color) => { 
    const {r,g,b} = colors.hex2dec(color);
    const hsl = colors.rgb2Hsl(r,g,b);
    const hsl_deCONZ = colors.hsl2HsldeCONZ(hsl);
    await deCONZapi.setColor(hsl_deCONZ);
}   

udpServer.messageParser =async  (msg) => { 
   
    if (msg.startsWith('0x'))
        await udpServer.colorParser(msg.substring(2));
    else if (msg == 'basic')
        await udpServer.colorParser('ffffff');
        //await deCONZapi.power(true);
}

udpServer.init = (params) => {

    udpServer.server = dgram.createSocket('udp4');

    udpServer.server.on('error', (err) => {
        //console.log(`server error:\n${err.stack}`);
        server.close();
    });

    udpServer.server.on('message', (msg, rinfo) => {
        //console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
        udpServer.messageParser(msg.toString());
    });

    udpServer.server.on('listening', () => {
        const address = udpServer.server.address();
        //console.log(address)
        console.log(`UDP server listening ${address.address}:${address.port}`);
    });

    udpServer.server.bind(params.port);
}

export default udpServer;