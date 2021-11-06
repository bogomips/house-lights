//import config from './config.mjs';
import * as http from 'http';

//console.log(http.request);
//const http = require("http");

const options = {  
    host : "localhost",
    port : 83,
    timeout : 2000,
    path: '/healthcheck'
};

const request = http.request(options, (res) => {  
    console.log(`Healthcheck response: ${res.statusCode}`);
    let exitCode = (res.statusCode == 200) ? 0 : 1;
    process.exit(exitCode);
});

request.on('error', function(err) {  
    console.log('Healthcheck timeout');
    process.exit(1);
});

request.end(); 
