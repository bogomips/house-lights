import Koa from 'koa';
//import koaRouter from 'koa-Router';
import compress from 'koa-compress';
import koaLogger from 'koa-logger';
import cors from '@koa/cors';

import zlib from 'zlib';
import chalk from 'chalk';
import config from './config.mjs';
import routes from './routes.mjs'

import udpServer from './helpers/udpServer.mjs'

const subSystemsInit  = async ()  => {

  udpServer.init({
    port: config.udpPort
  });

}

const koaSetup = ()  => { 

    const app = new Koa();
  
    //const router = new koaRouter();
    //router.get('/healthcheck', healthcheck);

    //routes.apply(router);
    const corsSetup={
      origin: function(ctx) {
        //if (ctx.url === '/test') {
        //  return false;
        //}
        return corsDomain;
      },
      //exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
      //maxAge: 5,
      //credentials: true,
      allowMethods: ['GET', 'POST', 'DELETE','OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    };
    app.use(koaLogger());
    app.use(cors(corsSetup));        
    app.use(routes.routes());
    app.use(compress({
      /*filter: function (content_type) {
        return /text/i.test(content_type)
      },
      threshold: 2048,*/
      //threshold: 1,
      flush: zlib.constants.Z_SYNC_FLUSH
    }));
    
     
    return app;
  
}

const main = async() => {

    await subSystemsInit();
    const app = koaSetup(); 
    app.listen(config.port);

    const  startString = '🚀     Server ready';
    console.log(chalk.green(startString),chalk.bold.whiteBright(`http://0.0.0.0:${config.port}`));

}

const corsDomain =  (process.env.NODE_ENV !== 'production') ? '*'  : '*' ;

// process.on('SIGINT', shutdown);
// process.on('SIGTERM', shutdown);

// console.log(chalk.cyan('🌱     NODE_ENV'),chalk.bold.whiteBright(process.env.NODE_ENV));
// console.log(chalk.red('👮     CORS DOMAIN'),chalk.bold.whiteBright(corsDomain));

main()