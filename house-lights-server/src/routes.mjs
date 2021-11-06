
import Router from '@koa/router'
import devicesSetup from './controllers/devicesSetup.mjs'

const router = new Router();

router.get('/devices-setup', devicesSetup);

router.options('/', (ctx,next) => {
    ctx.status=200;
});

export default router;


