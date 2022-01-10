
import Router from '@koa/router'
import devicesSetup from './controllers/devicesSetup.mjs'
import sceneSetup from './controllers/sceneSetup.mjs'

const router = new Router();

router.get('/devices-setup', devicesSetup);
router.put('/scene/:name', sceneSetup);

router.options('/', (ctx,next) => {
    ctx.status=200;
});

export default router;


