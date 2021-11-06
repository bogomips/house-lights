//import dbApi  from './dbApi.mjs'; 
//import cache_manager from './helpers/cache_manager.mjs';
//import config from './config.mjs';
import jcompose from './jsend.mjs';
//import _ from 'lodash';

const healthcheck = async(ctx) => { 

    let check_results = {
        vitals: {},
        optional: {}
    };

    let vital_failure = 0;

    /*try {
        let db = await dbApi.getDoc('cities',{_id:'ChIJ53USP0nBhkcRjQ50xhPN_zw'});
        _.set(check_results,'vitals.db.query',true);
    }
    catch(e) {
        _.set(check_results,'vitals.db.query',false);
        vital_failure++;
    }	*/

    // try {
    //     //let ping = await dbApi.ping();
    //     if (!ping.ok) vital_failure++;
    //     _.set(check_results,'vitals.mongodb.ping',ping.ok);
    // }
    // catch(e) {
    //     vital_failure++;
    //     _.set(check_results,'vitals.mongodb.ping',false);
    // }

    ctx.status = 200;
    ctx.body=jcompose(ctx.status,check_results);

}

export default healthcheck;
